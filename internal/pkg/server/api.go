package server

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/labstack/echo/v4"

	"github.com/michenriksen/gokiburi/internal/pkg/state"
)

func (s *Server) resultsHandler(c echo.Context) error {
	return c.JSON(http.StatusOK, s.getResults())
}

func (s *Server) pauseHandler(c echo.Context) error {
	if s.state != state.Ready {
		// Only allow client to pause if current state is Ready.
		return c.NoContent(http.StatusForbidden)
	}

	s.sendCommand(newCommand(Pause, ""))

	return c.NoContent(http.StatusAccepted)
}

func (s *Server) resumeHandler(c echo.Context) error {
	if s.state != state.Paused {
		// Only allow client to resume if current state is Paused.
		return c.NoContent(http.StatusForbidden)
	}

	s.sendCommand(newCommand(Resume, ""))

	return c.NoContent(http.StatusAccepted)
}

func (s *Server) clearResultsHandler(c echo.Context) error {
	s.clearResults()
	return c.NoContent(http.StatusOK)
}

func (s *Server) runHandler(c echo.Context) error {
	req := runRequest{}

	if ok, err := bindAndValidate(c, &req); !ok {
		return err
	}

	s.logger.Debug("emitting RunTests command", "data", req.Package)

	s.Commands <- newCommand(RunTests, req.Package)

	return c.NoContent(http.StatusAccepted)
}

func (s *Server) reportHandler(c echo.Context) error {
	uuid := c.Param("uuid")
	if !validUUID(uuid) {
		return c.NoContent(http.StatusBadRequest)
	}

	result := s.resultByUUID(uuid)
	if result == nil {
		return c.JSON(http.StatusNotFound, fmt.Errorf("no test result with UUID %s", uuid))
	}

	rpath := filepath.Join(result.Dir(), "report.json")

	report, err := os.Open(rpath)
	if err != nil {
		if os.IsNotExist(err) {
			s.logger.Error("can't find coverage report for result", logKeyUUID, uuid, "path", rpath)

			return c.JSON(
				http.StatusNotFound,
				fmt.Errorf("coverage report for result with UUID %s was not found", uuid),
			)
		}

		s.logger.Error("failed to read coverage report for result", logKeyUUID, uuid, logKeyError, err)

		return c.JSON(
			http.StatusInternalServerError,
			fmt.Errorf("failed to read coverage report for result with UUID %s", uuid),
		)
	}

	return c.Stream(200, "application/json", report)
}
