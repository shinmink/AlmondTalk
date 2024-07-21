package com.sparta.almondtalk.domain.user.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String name;
    private String email;
    private String profile;
    private String password;

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setProfile(String profile) {
        this.profile = profile;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public User(int id, String name, String email, String profile, String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.profile = profile;
        this.password = password;
    }

    @Override
    public String toString() {
        return "User [id=" + id + ", name=" + name + ", email=" + email + ", profile=" + profile + ", password="
                + password + "]";
    }

}