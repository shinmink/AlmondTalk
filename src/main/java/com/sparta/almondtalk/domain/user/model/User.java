package com.sparta.almondtalk.domain.user.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Entity
@Getter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String name;
    private String email;
    private String profile;
    private String password;

    private Double latitude;
    private Double longitude;

    public User(int id, String name, String email, String profile, String password, Double latitude, Double longitude) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.profile = profile;
        this.password = password;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    @Override
    public String toString() {
        return "User [id=" + id + ", name=" + name + ", email=" + email + ", profile=" + profile + ", password="
                + password + ", latitude=" + latitude + ", longitude=" + longitude + "]";
    }

}