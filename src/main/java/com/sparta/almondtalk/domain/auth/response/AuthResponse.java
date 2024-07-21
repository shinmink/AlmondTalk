package com.sparta.almondtalk.domain.auth.response;

import lombok.Getter;

public class AuthResponse {

    @Getter
    private String jwt;
    private boolean isAuth;

    public boolean isAuth() {
        return isAuth;
    }

    public void setAuth(boolean isAuth) {
        this.isAuth = isAuth;
    }

    public AuthResponse() {
    }

    public AuthResponse(String jwt, boolean isAuth) {
        this.jwt = jwt;
        this.isAuth = isAuth;
    }

    @Override
    public String toString() {
        return "AuthResponse [jwt=" + jwt + ", isAuth=" + isAuth + "]";
    }

}