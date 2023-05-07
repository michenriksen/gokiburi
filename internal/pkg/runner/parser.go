package runner

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/charmbracelet/log"
)

const floatBitSize = 64

var percentageRegexp = regexp.MustCompile(`(\d+(?:\.\d+)?)%`)

// Package is the result of tests in a single package.
type Package struct {
	Time     time.Time `json:"time"`
	Name     string    `json:"name"`
	Pass     bool      `json:"pass"`
	Passed   int       `json:"passed"`
	Skipped  int       `json:"skipped"`
	Failed   int       `json:"failed"`
	Coverage float64   `json:"coverage"`
	Elapsed  float64   `json:"elapsed"`
	Tests    []*Test   `json:"tests"`
	testMap  map[string]*Test
}

// Test result of a single test.
type Test struct {
	Time    time.Time `json:"time"`
	Name    string    `json:"name"`
	Package string    `json:"package"`
	Pass    bool      `json:"pass"`
	Skip    bool      `json:"skip"`
	Elapsed float64   `json:"elapsed"`
	Output  string    `json:"output"`
}

type parser struct {
	logger *log.Logger
}

func (p *parser) parse(out []byte) ([]*Package, error) {
	pkgMap := make(map[string]*Package)
	lineNum := 0
	scanner := bufio.NewScanner(bytes.NewReader(out))
	scanner.Split(bufio.ScanLines)

	for scanner.Scan() {
		lineNum++

		line := scanner.Bytes()
		event := goTestEvent{}

		if err := json.Unmarshal(line, &event); err != nil {
			p.logger.Error("error decoding line as Go test event", logKeyErr, err, logKeyLineNum, lineNum)
			p.logger.Debug(string(line), logKeyLineNum, lineNum)

			continue
		}

		if event.Package == "" {
			p.logger.Debug("ignoring non-test related event", "event", event)

			continue
		}

		p.ensurePkgAndTest(event, pkgMap)

		if err := p.handleEvent(event, pkgMap); err != nil {
			p.logger.Error("error handling event", logKeyErr, err, logKeyLineNum, lineNum)
			p.logger.Debug(string(line), logKeyLineNum, lineNum)
		}
	}

	return p.makePkgSlice(pkgMap), nil
}

func (p *parser) ensurePkgAndTest(e goTestEvent, pkgMap map[string]*Package) {
	if _, ok := pkgMap[e.Package]; !ok {
		p.logger.Debug("new package", "pkg", e.Package)

		pkgMap[e.Package] = &Package{
			Time:    e.Time,
			Name:    e.Package,
			testMap: make(map[string]*Test),
		}
	}

	if e.Test != "" {
		if _, ok := pkgMap[e.Package].testMap[e.Test]; !ok {
			p.logger.Debug("new test", "pkg", e.Package, "test", e.Test)

			pkgMap[e.Package].testMap[e.Test] = &Test{
				Name:    e.Test,
				Package: e.Package,
				Time:    e.Time,
			}
		}
	}
}

func (*parser) makePkgSlice(pkgMap map[string]*Package) []*Package {
	pkgs := make([]*Package, 0, len(pkgMap))

	for _, pkg := range pkgMap {
		tests := make([]*Test, 0, len(pkg.testMap))

		for _, test := range pkg.testMap {
			tests = append(tests, test)
		}

		pkg.Tests = tests
		pkg.testMap = nil

		pkgs = append(pkgs, pkg)
	}

	return pkgs
}

func (p *parser) handleEvent(e goTestEvent, pkgMap map[string]*Package) error {
	if e.Test == "" {
		return p.handlePackageEvent(e, pkgMap)
	}

	return p.handleTestEvent(e, pkgMap)
}

func (p *parser) handlePackageEvent(e goTestEvent, pkgMap map[string]*Package) error {
	pkg, ok := pkgMap[e.Package]
	if !ok {
		return fmt.Errorf("unknown package: %s", e.Package)
	}

	switch e.Action {
	case "pass":
		pkg.Pass = true
		pkg.Elapsed = e.Elapsed
	case "fail":
		pkg.Pass = false
		pkg.Elapsed = e.Elapsed
	case "output":
		if !strings.Contains(e.Output, "coverage:") {
			return nil
		}

		if match := percentageRegexp.FindStringSubmatch(e.Output); len(match) == 2 {
			c, err := strconv.ParseFloat(match[1], floatBitSize)
			if err != nil {
				return fmt.Errorf("parsing %q as float64: %w", match[1], err)
			}

			pkg.Coverage = c
		}
	default:
		p.logger.Debug("ignoring package event", "action", e.Action)
	}

	return nil
}

func (p *parser) handleTestEvent(e goTestEvent, pkgMap map[string]*Package) error {
	pkg, ok := pkgMap[e.Package]
	if !ok {
		return fmt.Errorf("unknown package: %s", e.Package)
	}

	test, ok := pkgMap[e.Package].testMap[e.Test]
	if !ok {
		return fmt.Errorf("unknown test for package %s: %s", e.Package, e.Test)
	}

	switch e.Action {
	case "pass":
		test.Pass = true
		test.Elapsed = e.Elapsed
		pkg.Passed++
	case "fail":
		test.Pass = false
		test.Elapsed = e.Elapsed
		pkg.Failed++
	case "skip":
		test.Skip = true
		test.Elapsed = e.Elapsed
		pkg.Skipped++
	case "output":
		test.Output += e.Output
	default:
		p.logger.Debug("ignoring test event", "action", e.Action)
	}

	return nil
}

type goTestEvent struct {
	Time    time.Time
	Action  string
	Package string
	Test    string
	Elapsed float64
	Output  string
}
