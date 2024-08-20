# AlmondTalk - 실시간 채팅 애플리케이션

AlmondTalk은 사용자 인증 및 그룹 채팅 기능을 제공하는 실시간 채팅 애플리케이션입니다. 이 프로젝트는 Spring Boot와 React를 기반으로 개발되었으며, WebSocket을 통해 실시간 메시지 전송을 지원합니다.

## 주요 기능

- **사용자 인증**: 회원가입, 로그인 기능 제공
- **프로필 관리**: 사용자 프로필 이미지 설정 및 정보 수정 가능
- **1:1 채팅**: 개인 간 실시간 채팅 기능
- **그룹 채팅**: 여러 사용자가 참여하는 그룹 채팅 기능
- **메시지 관리**: 텍스트 메시지, 파일 전송, 시스템 메시지 관리
- **위치 기반 사용자 검색**: 근처 사용자 검색 기능
- **스토리 기능**: 사용자 프로필에서 스토리 업로드 및 조회 가능

## 기술 스택

- **Frontend**: React, Redux, CSS
- **Backend**: Spring Boot, WebSocket, JWT, MySQL
- **Database**: MySQL
- **API**: Kakao Map API


## 설치 및 실행

### 백엔드 설치 및 실행

1. 저장소를 클론합니다.
   ```bash
   git clone https://github.com/yourusername/almondtalk.git
   cd almondtalk/backend```
   
2. 필요한 라이브러리를 설치합니다.
   ```./gradlew clean build```

3. Spring Boot 애플리케이션을 실행합니다.
   ```./gradlew bootRun```


5. 백엔드 서버가 http://localhost:8081에서 실행됩니다.


### 프론트엔드 설치 및 실행

1. 프론트엔드 디렉토리로 이동합니다.
   ```cd ../frontend```

2. 필요한 라이브러리를 설치합니다.
   ```npm install```

3. React 애플리케이션을 실행합니다.
    ```npm start```
   
4. 프론트엔드 서버가 http://localhost:3000에서 실행됩니다.


### 사용법
1. 웹 브라우저에서 http://localhost:3000을 엽니다.
2. 회원가입 또는 로그인 후 채팅을 시작합니다.
3. 새로운 채팅방을 생성할 수 있습니다.
4. 실시간으로 메시지를 주고받을 수 있습니다.

## 개발적 선택

- **JWT 인증**: Stateless 인증 방식으로 서버 확장성과 보안성을 강화.
- **WebSocket**: HTTP보다 효율적인 실시간 데이터 전송을 위해 WebSocket을 사용.
- **Kakao Map API**: 위치 기반 사용자 검색 기능을 위해 직관적이고 사용하기 쉬운 Kakao Map API를 선택.



