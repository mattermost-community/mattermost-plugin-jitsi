package main

import (
	"testing"
	"time"

	"github.com/cristalhq/jwt/v2"
	"github.com/stretchr/testify/require"
)

func TestVerifyJwt(t *testing.T) {
	testToken := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.mpHl842O7xEZjgQ8CyX8xYLDoEORGVMnAxULkW-u8Ek"
	t.Run("bad secret should fail", func(t *testing.T) {
		claims, err := verifyJwt("bad-secret", testToken)
		require.NotNil(t, err)
		require.Nil(t, claims)
	})
	t.Run("right secret should work", func(t *testing.T) {
		claims, err := verifyJwt("test-secret", testToken)
		require.Nil(t, err)
		require.Equal(t, "1234567890", claims.Subject)
		issuedAt, err := claims.IssuedAt.MarshalJSON()
		require.Nil(t, err)
		require.Equal(t, "1516239022", string(issuedAt))
	})
}

func TestSignClaims(t *testing.T) {
	claims := Claims{}
	claims.Issuer = "test"
	claims.Audience = []string{"test-app-id"}
	claims.ExpiresAt = jwt.NewNumericDate(time.Time{})
	claims.Subject = "test"
	claims.Room = "test"

	token, err := signClaims("test-secret", &claims)
	require.Nil(t, err)

	newClaims, err := verifyJwt("test-secret", token)
	require.Nil(t, err)
	require.Equal(t, &claims, newClaims)
}
