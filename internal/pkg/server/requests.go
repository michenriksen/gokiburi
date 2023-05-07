package server

import (
	"net/http"
	"regexp"

	"github.com/invopop/validation"
	"github.com/labstack/echo/v4"
)

var (
	uuidRegexp = regexp.MustCompile(`^[\w_-]{21}$`)
	pkgRegexp  = regexp.MustCompile(`^[\w\.\/_-]+$`)
)

type runRequest struct {
	Package string `json:"package"`
}

func (r runRequest) Validate() error {
	validation.ErrorTag = "json"

	return validation.ValidateStruct(&r,
		validation.Field(&r.Package,
			validation.Required,
			validation.Match(pkgRegexp).Error("must be a valid package name"),
		),
	)
}

func validUUID(s string) bool {
	return uuidRegexp.MatchString(s)
}

func bindAndValidate(c echo.Context, i any) (ok bool, err error) {
	if err = c.Bind(i); err != nil {
		return false, c.NoContent(http.StatusBadRequest)
	}

	if vi, ok := i.(validation.Validatable); ok {
		if err = vi.Validate(); err != nil {
			return false, c.JSON(http.StatusUnprocessableEntity, err)
		}
	}

	return true, nil
}
