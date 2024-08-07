package com.sparta.almondtalk.domain.user.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdateUserRequest {

    private String name;

    private String profile;

    public UpdateUserRequest() {
    }

    public UpdateUserRequest(String name, String profile) {
        this.name = name;
        this.profile = profile;
    }

    @Override
    public String toString() {
        return "UpdateUserRequest [name=" + name + ", profile=" + profile + "]";
    }

}