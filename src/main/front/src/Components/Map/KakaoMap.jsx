import React, { useEffect } from "react";

// KakaoMap 컴포넌트 정의
const KakaoMap = ({ nearbyUsers = [] }) => {
    useEffect(() => {
        // 카카오맵 스크립트 로드
        const script = document.createElement("script");
        script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=361ecf4965be74a05c64aa4f62636480&autoload=false&libraries=services';
        script.async = true;
        script.defer = true;


        // 스크립트 로드 오류 처리 추가
        script.onerror = () => {
            console.error("Failed to load the Kakao Maps script.");
        };

        document.head.appendChild(script);

        script.onload = () => {
            // 카카오맵 API가 로드되었는지 확인
            if (!window.kakao || !window.kakao.maps) {
                console.error("Kakao Maps API failed to load.");
                return;
            }

            // 카카오맵 로드가 완료된 후 지도 초기화
            window.kakao.maps.load(() => {
                const container = document.getElementById("map");
                const options = {
                    center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 기본 위치 설정
                    level: 3,
                };
                const map = new window.kakao.maps.Map(container, options);

                // 현재 위치를 가져와서 지도 중심 이동 및 마커 표시
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;

                        const locPosition = new window.kakao.maps.LatLng(latitude, longitude); // 현재 위치

                        // 현재 위치 마커 생성
                        const marker = new window.kakao.maps.Marker({
                            map: map,
                            position: locPosition,
                        });

                        const message = '<div style="padding:5px;">You are here</div>';
                        const infowindow = new window.kakao.maps.InfoWindow({
                            content: message,
                            removable: true,
                        });

                        // 인포윈도우를 지도에 표시
                        infowindow.open(map, marker);

                        // 지도 중심을 현재 위치로 이동
                        map.setCenter(locPosition);

                        // 근처 사용자들 위치에 마커 표시
                        nearbyUsers.forEach(user => {
                            if (user.latitude && user.longitude) {
                                console.log('User Position:', user.latitude, user.longitude); // 확인 로그
                                const userPosition = new window.kakao.maps.LatLng(user.latitude, user.longitude);
                                const userMarker = new window.kakao.maps.Marker({
                                    map: map,
                                    position: userPosition,
                                });

                                const userInfowindow = new window.kakao.maps.InfoWindow({
                                    content: `<div style="padding:5px;">${user.name}</div>`,
                                    removable: true,
                                });

                                userInfowindow.open(map, userMarker);
                            } else {
                                console.error('Invalid latitude or longitude for user:', user);
                            }
                        });
                    }, function(error) {
                        console.error("Error getting location:", error);
                        // 위치 정보를 가져오는 데 실패했을 때 기본 위치로 설정
                        handleGeolocationError(map);
                    });
                } else {
                    // Geolocation을 사용할 수 없을 때 기본 위치로 지도 설정
                    handleGeolocationError(map);
                }
            });
        };
    }, [nearbyUsers]); // nearbyUsers가 변경될 때마다 지도 갱신

    const handleGeolocationError = (map) => {
        const locPosition = new window.kakao.maps.LatLng(33.450701, 126.570667); // 기본 위치
        const marker = new window.kakao.maps.Marker({
            map: map,
            position: locPosition,
        });

        const message = 'Geolocation is not supported by this browser or location access was denied.';
        const infowindow = new window.kakao.maps.InfoWindow({
            content: message,
            removable: true,
        });

        infowindow.open(map, marker);
        map.setCenter(locPosition);
    };

    return <div id="map" style={{ width: "100%", height: "400px" }} />;
};

export default KakaoMap;