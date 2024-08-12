import React, { useEffect } from "react";

const KakaoMap = () => {
    useEffect(() => {
        // 카카오맵 스크립트 로드
        const script = document.createElement("script");
        script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=361ecf4965be74a05c64aa4f62636480&autoload=false&libraries=services';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                // 기본 지도 옵션 설정
                const container = document.getElementById("map");
                const options = {
                    center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 기본 위치 설정
                    level: 3,
                };
                const map = new window.kakao.maps.Map(container, options);

                // 현재 위치를 가져와서 지도 중심 이동 및 마커 표시
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;

                        const locPosition = new window.kakao.maps.LatLng(lat, lon); // 현재 위치

                        // 마커와 인포윈도우 생성
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
                    });
                } else {
                    // Geolocation을 사용할 수 없을 때 기본 위치로 지도 설정
                    const locPosition = new window.kakao.maps.LatLng(33.450701, 126.570667);
                    const marker = new window.kakao.maps.Marker({
                        map: map,
                        position: locPosition,
                    });

                    const message = 'Geolocation is not supported by this browser.';
                    const infowindow = new window.kakao.maps.InfoWindow({
                        content: message,
                        removable: true,
                    });

                    infowindow.open(map, marker);
                    map.setCenter(locPosition);
                }
            });
        };
    }, []);

    return <div id="map" style={{ width: "100%", height: "400px" }} />;
};

export default KakaoMap;