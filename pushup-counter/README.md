# 푸시업 자막 카운터

푸시업 영상을 올리면 자세를 인식해서 1회마다 카운트 자막을 넣고, 인스타 스토리용 mp4로 저장해 주는 웹앱.
서버 없이 브라우저 안에서만 돌아간다 (MediaPipe Pose Landmarker lite).

## GitHub Pages에 올리기

1. GitHub에서 새 저장소를 만든다 (예: `pushup-counter`, Public).
2. 이 폴더 안의 파일을 폴더 구조 그대로 저장소 루트에 올린다.
   - 웹에서 올릴 땐 "Add file → Upload files"에 폴더째 끌어다 놓으면 된다.
   - 또는 터미널에서:
     ```bash
     git init && git add . && git commit -m "init"
     git branch -M main
     git remote add origin https://github.com/<아이디>/pushup-counter.git
     git push -u origin main
     ```
3. 저장소 Settings → Pages → Source를 "Deploy from a branch", Branch를 `main` / `(root)`로 두고 저장.
4. 1~2분 뒤 `https://<아이디>.github.io/pushup-counter/` 에서 열린다.

## 폰에서 앱처럼 쓰기

- 아이폰 사파리: 주소 열기 → 공유 버튼 → "홈 화면에 추가"
- 안드로이드 크롬: 주소 열기 → 메뉴(⋮) → "홈 화면에 추가" 또는 "앱 설치"

첫 실행 때 인식 모델(약 15MB)을 받아 두고, 그다음부터는 폰에 저장된 걸 써서 빨리 뜬다.

## 파일 구성

| 경로 | 내용 |
| --- | --- |
| `index.html` | 앱 전체 (UI, 카운트 로직, 자막 렌더링, 녹화) |
| `lib/` | MediaPipe tasks-vision 0.10.21 (JS + WASM) |
| `model/pose_landmarker_lite.task` | 자세 인식 모델 |
| `sw.js` | 모델·엔진을 폰에 캐시하는 서비스 워커 |
| `manifest.webmanifest`, `icons/` | 홈 화면 추가용 |

## 수정했을 때

`index.html`만 바꿨으면 그냥 push하면 된다. `lib/`나 `model/`을 바꿨으면 `sw.js`의 `CACHE` 이름(`pushup-v1`)을 올려야 폰에 남은 옛 파일이 교체된다.
