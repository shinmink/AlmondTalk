package com.sparta.almondtalk.domain.auth.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginRequest {

    private String email;
    private String password;

    private Double latitude;
    private Double longitude;

    public LoginRequest() {
    }

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    @Override
    public String toString() {
        return "LoginRequest [email=" + email + ", password=" + password + "]";
    }

}
