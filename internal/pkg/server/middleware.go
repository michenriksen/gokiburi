package server

import (
	"github.com/labstack/echo/v4"
)

// apiHeaders adds response headers to disable browser caching for API
// endpoints.
func apiHeaders() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			res := c.Response()

			res.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
			res.Header().Set("Pragma", "no-cache")
			res.Header().Set("Expires", "0")

			return next(c)
		}
	}
}
