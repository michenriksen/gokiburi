package server

type notification struct {
	Type string `json:"type"`
	Body string `json:"body"`
	Tag  string `json:"tag"`
}
