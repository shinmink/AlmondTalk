import React, { useEffect } from "react";

// KakaoMap 컴포넌트 정의
const KakaoMap = ({ nearbyUsers = [] }) => {
    useEffect(() => {
        console.log("Nearby users in KakaoMap:", nearbyUsers); // 콘솔 로그로 nearbyUsers 확인


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
                            // 마커 크기 및 색상 설정
                            image: new window.kakao.maps.MarkerImage(
                                'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                                new window.kakao.maps.Size(36, 37) // 마커 이미지 크기
                            )
                        });

                        const message = '<div style="padding:5px;">현재 내 위치</div>';
                        const infowindow = new window.kakao.maps.InfoWindow({
                            content: message,
                            removable: true,
                        });

                        // 인포윈도우를 지도에 표시
                        infowindow.open(map, marker);

                        // 지도 중심을 현재 위치로 이동
                        map.setCenter(locPosition);

                        // 근처 사용자들 위치에 커스텀 오버레이 표시
                        nearbyUsers.forEach(user => {
                            if (user.latitude && user.longitude) {
                                console.log('User Position:', user.latitude, user.longitude);
                                const userPosition = new window.kakao.maps.LatLng(user.latitude, user.longitude);

                                const userMarker = new window.kakao.maps.Marker({
                                    map: map,
                                    position: userPosition,
                                    image: new window.kakao.maps.MarkerImage(
                                        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
                                        new window.kakao.maps.Size(36, 37)
                                    )
                                });

                                // 커스텀 오버레이 생성
                                const overlayContent = document.createElement('div');
                                overlayContent.innerHTML = `
                                    <div style="
                                        padding: 5px 10px;
                                        background: #ffffff;
                                        border-radius: 8px;
                                        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
                                        color: #333;
                                        font-size: 14px;
                                        font-weight: bold;
                                        text-align: center;
                                        white-space: nowrap;
                                    ">
                                        ${user.name}
                                    </div>
                                `;

                                const customOverlay = new window.kakao.maps.CustomOverlay({
                                    map: map,
                                    position: userPosition,
                                    content: overlayContent,
                                    yAnchor: 2.5, // 마커 위에 표시되도록 y축 조정
                                });

                                // 마커 클릭 시 오버레이 토글
                                window.kakao.maps.event.addListener(userMarker, 'click', () => {
                                    if (customOverlay.getMap()) {
                                        customOverlay.setMap(null); // 오버레이를 숨김
                                    } else {
                                        customOverlay.setMap(map); // 오버레이를 표시
                                    }
                                });

                                // 오버레이를 지도에 표시
                                customOverlay.setMap(map);
                            } else {
                                console.error('Invalid latitude or longitude for user:', user);
                            }
                        });
                    }, function (error) {
                        console.error("Error getting location:", error);
                        handleGeolocationError(map);
                    });
                } else {
                    handleGeolocationError(map);
                }
            });
        };
    }, [nearbyUsers]);

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