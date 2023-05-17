package collections

import (
	"context"

	"dagger.io/dagger"

	"github.com/michenriksen/gokiburi/ci/backend"
	"github.com/michenriksen/gokiburi/ci/frontend"
	"github.com/michenriksen/gokiburi/ci/gha"
)

func Build(ctx context.Context, client *dagger.Client, args []string) {
	frontend.Build(ctx, client, args)
	backend.Build(ctx, client, args)
}

func Verify(ctx context.Context, client *dagger.Client, args []string) {
	backend.Verify(ctx, client, args)
	frontend.Verify(ctx, client, args)
}

func Lint(ctx context.Context, client *dagger.Client, args []string) {
	backend.Lint(ctx, client, args)
	frontend.Lint(ctx, client, args)
	gha.Lint(ctx, client, args)
}

func Test(ctx context.Context, client *dagger.Client, args []string) {
	backend.Test(ctx, client, args)
	frontend.Test(ctx, client, args)
}

func Audit(ctx context.Context, client *dagger.Client, args []string) {
	backend.Audit(ctx, client, args)
	frontend.Audit(ctx, client, args)
}
