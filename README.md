# 🤖 RustPlusBot (Advanced Enterprise Edition)

RustPlusBot은 다중 Rust 서버를 모니터링하고 제어할 수 있는 올인원 시스템입니다. 인게임 팀 채팅 제어, Discord 봇 알림, 그리고 최신 Next.js 14 기반의 웹 대시보드를 통합 제공합니다.

---

## ✨ 주요 기능

1. **📱 Rust+ 연동 코어 엔진**
   - 다중 서버 동시 연결 및 스마트 백오프 재연결 지원.
   - 스마트 스위치, 알람, 보관함 모니터 등 인게임 기기 원격 제어.
2. **💬 인게임 팀 채팅 명령어 (14종)**
   - `!pop`, `!night`, `!craft`, `!recycle`, `!events` 등 주요 기능들을 디스코드나 웹에 들어갈 필요 없이 인게임 팀 채팅에서 바로 사용 가능합니다.
3. **🔔 Discord 봇 & 알림 통합**
   - 서버 이벤트 (헬기, 카고 등) 및 스마트 알람 발생 시 지정된 디스코드 채널로 실시간 푸시 알림 전송.
   - 1분 주기 서버 현황 자동 갱신 트래커 보드 지원.
   - (선택) TTS 기능을 통해 음성 채널로 경고 알림 방송.
4. **🌐 웹 대시보드 (Next.js)**
   - Steam OpenID를 통한 안전한 로그인.
   - 라이브 맵, 기기 상태, 팀원 접속 여부 및 통계(플레이타임, 데스 수)를 직관적인 프리미엄 다크 모드 UI로 모니터링.

---

## 🏗 인프라 구조 (Turborepo)

- `apps/bot`: Node.js + Fastify 기반의 백엔드 봇 (Rust+ 통신, Discord 연동, WebSocket 서버)
- `apps/web`: Next.js 14 + TailwindCSS 기반의 프론트엔드 대시보드
- `packages/*`: 공유 타입, Rust 게임 데이터(아이템, 건물 HP 등)
- **Database**: PostgreSQL (Prisma ORM)

---

## 🚀 새 VPS에서 배포하는 방법 (Docker 기반)

새로운 클라우드 VPS(Ubuntu/Debian 기준)를 구매한 후, 아래 순서대로 진행하면 한 번에 전체 시스템을 구동할 수 있습니다.

### 1. 필수 프로그램 설치
터미널에 접속하여 Docker와 Git을 설치합니다.
```bash
sudo apt update
sudo apt install -y git docker.io docker-compose
```

### 2. 프로젝트 가져오기
서버로 프로젝트 파일을 업로드하거나 Git을 통해 클론합니다.
```bash
git clone https://github.com/your-repo/rustplusbot.git
cd rustplusbot
```

### 3. 환경 변수 설정 (`.env`)
프로젝트 루트 디렉토리에 있는 `.env.example` 파일을 복사하여 `.env` 파일을 생성합니다.
```bash
cp .env.example .env
nano .env
```
아래 항목들을 반드시 본인의 정보로 채워주세요.
- `STEAM_API_KEY`: 스팀 로그인 연동을 위해 필요합니다. [Steam API 키 발급](https://steamcommunity.com/dev/apikey)
- `DISCORD_BOT_TOKEN`: Discord 개발자 포털에서 발급받은 봇 토큰.
- `DISCORD_APPLICATION_ID`: Discord 봇 어플리케이션 ID.
- `DISCORD_GUILD_ID`: 봇이 동작할 메인 디스코드 서버 ID.
- `JWT_SECRET`, `ENCRYPTION_KEY`: 아무렇게나 아주 긴 임의의 영문/숫자 조합을 입력하세요.

> **💡 Rust+ FCM 인증 정보 연동 안내**
> 파이어베이스 자격 증명(FCM)은 이제 `.env` 파일에 복잡하게 입력할 필요가 없습니다. 
> 봇 서버를 실행시킨 뒤, **디스코드 채팅창에 아래 명령어를 바로 입력**하면 봇이 실시간으로 인증을 처리하고 저장합니다!
> 
> `/credentials add data: gcm_android_id:... gcm_security_token:... steam_id:...`

### 4. Docker Compose로 배포하기
모든 설정이 완료되었다면 아래 명령어를 입력하여 빌드 및 백그라운드 실행을 시작합니다.
```bash
sudo docker-compose up -d --build
```

### 5. 정상 작동 확인
컨테이너들이 잘 실행되었는지 확인합니다.
```bash
sudo docker-compose ps
sudo docker-compose logs -f bot  # 봇 에러 로그 확인
```

### 6. 접속하기
웹 브라우저를 열고 VPS의 IP 주소(포트 80)로 접속합니다.
- 예: `http://123.456.78.90`
- Nginx 리버스 프록시가 자동으로 프론트엔드(`3000`)와 웹소켓 백엔드(`3001`) 요청을 라우팅해 줍니다.

---

## 🕹 자주 사용하는 명령어

### Discord 봇 명령어 (Slash Commands)
- `/credentials add`: 봇을 본인의 Rust 계정과 연결하기 위해 FCM 토큰을 주입하는 명령어입니다. (최초 1회)
- `/server info`: 연결된 서버들의 인원수 및 상태를 확인합니다.
- `/events`: 최근 발생한 주요 서버 이벤트를 조회합니다.
- `/vend [아이템명]`: 전체 자판기에서 특정 아이템을 검색합니다.

### 인게임 팀 채팅 명령어
- `!pop` : 서버 인원 및 대기열 확인
- `!night` : 게임 내 시간 및 밤/낮까지 남은 현실 시간 확인
- `!status [기기명]` : 스마트 스위치/알람 상태 및 보관함 모니터 용량 확인
- `!craft [수량] [아이템]` : 제작 시간 계산
- `!durability [건축물]` : 해당 건축물을 부수기 위한 폭발물 비용 계산

---

## 🛠 유지보수 및 문제해결

**봇을 재시작하고 싶을 때:**
```bash
sudo docker-compose restart bot
```

**업데이트된 코드를 서버에 반영할 때:**
```bash
git pull
sudo docker-compose up -d --build
```

**디스코드 봇이 응답하지 않을 때:**
`.env`의 토큰이 정확한지 확인하고 `sudo docker-compose logs bot`을 입력하여 오류 메세지를 확인하세요.
