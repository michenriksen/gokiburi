package ciutil

import "os"

func EnvWithDefault(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}

	return value
}

func MustEnv(key string) string {
	value := os.Getenv(key)
	if value == "" {
		PrintFatal("environment variable %s must be set\n", key)
	}

	return value
}
