# Server Management

이 문서는 `back.sku-sku.com` 서버에서 `lab-progress-pal` 프론트엔드와 기존 백엔드 jar를 다시 실행하거나 상태를 확인할 때 필요한 운영 메모입니다.

## SSH 접속

로컬 프로젝트 루트의 `likelionSKU.pem` 키를 사용합니다.

```bash
ssh -i likelionSKU.pem ubuntu@back.sku-sku.com
```

MySQL 터널링이 필요하면 아래처럼 접속합니다.

```bash
ssh -i likelionSKU.pem -L 3307:localhost:3306 ubuntu@back.sku-sku.com
```

Windows OpenSSH에서 private key 권한 오류가 나면 로컬 PowerShell에서 키 권한을 현재 사용자 읽기 권한으로 제한합니다.

```powershell
icacls .\likelionSKU.pem /inheritance:r
icacls .\likelionSKU.pem /grant:r "yjlang\303:(R)"
icacls .\likelionSKU.pem /remove "Users" "Authenticated Users" "Everyone" "BUILTIN\Users"
```

## 서비스 구조

| 서비스 | 서버 경로 | 실행 방식 | 내부 포트 | 외부 URL |
| --- | --- | --- | --- | --- |
| 백엔드 jar | `/home/ubuntu/backend` | `java -jar` + `nohup` | `8083` | `http://backend.sku-sku.com/` |
| lab-progress-pal | `/home/ubuntu/lab-progress-pal` | `bun run dev` + `nohup` | `8085` | `http://13.124.62.85/` |
| Docker 서비스 | Docker compose/container | Docker | `8088`, `3307`, `6380` | `http://final.sku-sku.com/` 등 |

nginx는 다음처럼 프록시합니다.

- `backend.sku-sku.com` -> `localhost:8083`
- `13.124.62.85` -> `127.0.0.1:8085`
- `final.sku-sku.com` -> `localhost:8088`

## 백엔드 jar 재실행

서버 접속 후 실행합니다.

```bash
cd ~/backend
nohup java -jar backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=build > nohup.out 2>&1 &
echo $! > backend.pid
```

상태 확인:

```bash
pgrep -af 'backend-0.0.1-SNAPSHOT.jar'
ss -ltnp | grep ':8083'
tail -n 100 ~/backend/nohup.out
curl -I http://127.0.0.1:8083/
curl -I http://backend.sku-sku.com/
```

정상 기동 시 로그에 아래와 비슷한 내용이 보입니다.

```text
Tomcat started on port 8083
Started SkuSkuApplication
```

루트 접근은 Google OAuth로 `302` redirect 될 수 있으며, 이 경우도 서버가 응답 중인 상태입니다.

## lab-progress-pal 재실행

`preview`는 Cloudflare Vite plugin이 `.wrangler/deploy/config.json`을 요구할 수 있어 현재 서버에서는 `dev` 명령으로 실행합니다.

```bash
cd ~/lab-progress-pal
nohup ~/.bun/bin/bun run dev --host 127.0.0.1 --port 8085 > nohup.out 2>&1 &
echo $! > lab-progress-pal.pid
```

상태 확인:

```bash
pgrep -af 'vite dev|bun.*dev|node.*vite'
ss -ltnp | grep ':8085'
tail -n 100 ~/lab-progress-pal/nohup.out
curl -I http://127.0.0.1:8085/
curl -I http://13.124.62.85/
```

정상 기동 시 로그에 아래와 비슷한 내용이 보입니다.

```text
VITE v7.x ready
Local: http://127.0.0.1:8085/
```

## 프로세스 종료

각 서비스의 pid 파일이 있으면 해당 PID를 종료합니다.

```bash
kill "$(cat ~/backend/backend.pid)"
kill "$(cat ~/lab-progress-pal/lab-progress-pal.pid)"
```

pid 파일이 없거나 맞지 않으면 프로세스를 검색한 뒤 종료합니다.

```bash
pgrep -af 'backend-0.0.1-SNAPSHOT.jar'
pgrep -af 'vite dev|bun.*dev|node.*vite'
```

## Docker 서비스 확인

현재 Docker 쪽에는 `mp-backend`, `mp-mysql`, `mp-redis` 컨테이너가 사용됩니다.

```bash
docker ps
```

주요 포트:

- `mp-backend`: host `8088` -> container `8080`
- `mp-mysql`: host `3307` -> container `3306`
- `mp-redis`: host `6380` -> container `6379`

## 로그 백업 팁

기존 로그를 보존하고 새로 시작하려면 실행 전에 백업합니다.

```bash
cd ~/backend
cp nohup.out "nohup.out.$(date +%Y%m%d-%H%M%S).bak"
: > nohup.out
```

```bash
cd ~/lab-progress-pal
cp nohup.out "nohup.out.$(date +%Y%m%d-%H%M%S).bak"
: > nohup.out
```

