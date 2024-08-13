package com.sparta.almondtalk.domain.user.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class NearbyRequest {
    private double latitude;
    private double longitude;
    private double radius;

}
