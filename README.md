# AlmondTalk

AlmondTalk은 실시간 채팅 애플리케이션으로, 사용자들이 실시간으로 메시지를 주고받을 수 있도록 설계되었습니다. 이 프로젝트는 Spring Boot와 React를 사용하여 구현되었습니다.

## 주요 기능

- **실시간 메시징**: 웹소켓을 통한 실시간 메시지 전송 및 수신
- **사용자 인증**: JWT를 이용한 사용자 인증 및 권한 부여
- **채팅방 생성 및 관리**: 1:1 채팅 및 그룹 채팅 기능
- **프로필 관리**: 사용자는 자신의 프로필을 관리할 수 있습니다.

## 기술 스택

- **백엔드**: Spring Boot, Spring Security, Spring WebSocket
- **프론트엔드**: React, Redux, SockJS, STOMP
- **데이터베이스**: H2 Database (개발용)
- **빌드 도구**: Gradle
- **기타**: JWT, Lombok


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




