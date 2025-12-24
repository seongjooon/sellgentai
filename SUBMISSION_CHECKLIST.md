# ✅ 크롬 웹 스토어 제출 체크리스트

## 🎉 완료된 작업

### 1. 기본 설정 ✅
- [x] package.json 업데이트 (name, description, version)
- [x] wxt.config.ts manifest 정보 추가
- [x] 다국어 지원 파일 생성 (_locales/ko, _locales/en)
- [x] 아이콘 확인 (16, 32, 48, 96, 128px)

### 2. 문서화 ✅
- [x] README.md 한글/영문 버전 작성
- [x] PRIVACY_POLICY.md 작성
- [x] STORE_SUBMISSION_GUIDE.md 작성

### 3. 보안 및 권한 ✅
- [x] 권한 최소화 (storage, activeTab만 사용)
- [x] host_permissions 명시 (*.coupang.com)
- [x] 개인정보 수집하지 않음 명시

### 4. 빌드 및 테스트 ✅
- [x] 프로덕션 빌드 성공
- [x] ZIP 파일 생성 성공
- [x] .gitignore 확인

## 📦 빌드 결과

```
✔ Built extension in 461 ms
  ├─ manifest.json               802 B
  ├─ sidebar.html                327 B
  ├─ background.js               743 B
  ├─ chunks/sidebar-GxnO7fO9.js  212.98 kB
  ├─ content-scripts/content.js  7.18 kB
  ├─ _locales/en/messages.json   479 B
  ├─ _locales/ko/messages.json   501 B
  ├─ icon/* (5 files)            8.24 kB
  └─ wxt.svg                     1.07 kB

✔ Zipped: marginscan-1.0.0-chrome.zip (81.35 kB)
```

## 📸 제출 전 남은 작업

### 1. 스크린샷 준비 (필수)
크롬 웹 스토어에 업로드할 스크린샷 촬영:

**요구사항:**
- 크기: 1280x800 또는 640x400
- 형식: PNG 또는 JPG
- 최대 파일 크기: 각 5MB
- 최소 1개, 최대 5개

**추천 스크린샷:**
1. [ ] 메인 화면 - 마진 계산 결과 표시
2. [ ] 목표 마진율 설정 및 추천 사입가 기능
3. [ ] 수수료 상세 분석 화면
4. [ ] 상품 크기 선택 및 물류비 계산
5. [ ] 쿠팡 직매입 경고 화면

### 2. 개인정보 처리방침 URL 준비 (필수)
다음 중 하나 선택:

- [ ] GitHub Pages로 호스팅
  ```bash
  # GitHub 저장소 Settings > Pages에서 활성화
  # URL: https://[username].github.io/marginscan/PRIVACY_POLICY.html
  ```

- [ ] 별도 웹사이트에 호스팅
  ```
  예: https://your-domain.com/marginscan/privacy-policy
  ```

### 3. 프로모션 이미지 준비 (선택, 권장)

**Small promo tile (440x280):**
- [ ] MarginScan 로고 + 간단한 설명

**Large promo tile (920x680 또는 1400x560):**
- [ ] 프로모션 이미지

### 4. Chrome Developer Dashboard 등록

1. [ ] https://chrome.google.com/webstore/devconsole 접속
2. [ ] 개발자 계정 등록 ($5 일회성 비용)
3. [ ] "새 항목" 클릭
4. [ ] ZIP 파일 업로드 (.output/marginscan-1.0.0-chrome.zip)

### 5. 스토어 정보 입력

**기본 정보:**
```
이름: MarginScan - 로켓그로스 마진 계산기
요약: 쿠팡 로켓그로스 셀러를 위한 실시간 마진 계산 도구
카테고리: 쇼핑 (Shopping)
언어: 한국어 (Korean)
```

**상세 설명:**
- [ ] STORE_SUBMISSION_GUIDE.md의 상세 설명 복사

**스크린샷:**
- [ ] 스크린샷 업로드 (최소 1개)

**아이콘:**
- [ ] 128x128 아이콘 (자동 포함됨)

**개인정보:**
- [ ] 개인정보 처리방침 URL 입력
- [ ] "사용자 데이터를 수집하지 않음" 선택

**권한 설명:**
- [ ] storage: "목표 마진율 설정을 브라우저에 저장"
- [ ] activeTab: "쿠팡 상품 정보를 읽어 마진 계산"
- [ ] host_permissions: "쿠팡 페이지에서만 작동"

### 6. 최종 확인

- [ ] 모든 기능이 정상 작동하는가?
- [ ] 에러가 발생하지 않는가?
- [ ] 스크린샷이 준비되었는가?
- [ ] 개인정보 처리방침 URL이 준비되었는가?
- [ ] "비공식 도구"임을 명시했는가?
- [ ] 쿠팡 로고를 무단 사용하지 않았는가?

### 7. 제출

- [ ] "검토 제출" 클릭
- [ ] 검토 대기 (보통 1-3일 소요)

## 🚨 제출 시 주의사항

### ❌ 절대 하지 말 것
1. "쿠팡 공식" 또는 "쿠팡 승인"으로 오인될 표현
2. 사용자 데이터를 외부로 전송
3. 불필요한 권한 추가
4. 쿠팡 로고 무단 사용

### ✅ 반드시 할 것
1. "비공식 도구"임을 명시
2. 개인정보를 수집하지 않음을 강조
3. 충분한 테스트 후 제출
4. 개인정보 처리방침 URL 제공

## 📞 검토 결과

### 승인 시
- [ ] Chrome Web Store 링크 저장
- [ ] 사용자 피드백 모니터링
- [ ] 버그 리포트 대응

### 거부 시
- [ ] 거부 사유 확인
- [ ] 필요한 수정 사항 반영
- [ ] 재제출

## 📋 유용한 링크

- Chrome Developer Dashboard: https://chrome.google.com/webstore/devconsole
- Chrome Web Store 개발자 정책: https://developer.chrome.com/docs/webstore/program-policies/
- 확장 프로그램 품질 가이드라인: https://developer.chrome.com/docs/webstore/best_practices/

---

**준비가 완료되면 제출하세요! 🚀**
