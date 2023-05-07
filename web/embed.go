package web

import "embed"

//go:embed all:app/build/*
var StaticAssetFS embed.FS
