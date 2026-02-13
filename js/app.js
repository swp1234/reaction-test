// 반응속도 테스트 앱
class ReactionTest {
    constructor() {
        this.times = [];
        this.currentRound = 0;
        this.isActive = false;
        this.startTime = null;
        this.waitTimeout = null;
        this.minWaitTime = 1000;
        this.maxWaitTime = 5000;

        this.initElements();
        this.initEventListeners();
        this.initI18n();

        // Safety timeout: hide loader after 3s even if i18n fails
        setTimeout(() => {
            const loader = document.getElementById('app-loader');
            if (loader && !loader.classList.contains('hidden')) {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 300);
            }
        }, 3000);
    }

    initElements() {
        // 화면
        this.introScreen = document.getElementById('intro-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.resultScreen = document.getElementById('result-screen');

        // 게임 영역
        this.gameArea = document.getElementById('game-area');
        this.gameStatus = document.getElementById('game-status');
        this.gameInfo = document.getElementById('game-info');
        this.roundBadge = document.getElementById('round-badge');
        this.roundNumber = document.getElementById('round-number');
        this.timerDisplay = document.getElementById('timer-display');

        // 결과
        this.avgTime = document.getElementById('avg-time');
        this.gradeDisplay = document.getElementById('grade-display');
        this.gradeIcon = document.getElementById('grade-icon');
        this.gradeName = document.getElementById('grade-name');
        this.percentile = document.getElementById('percentile');
        this.timeList = document.getElementById('time-list');

        // 버튼
        this.startBtn = document.getElementById('start-btn');
        this.retryBtn = document.getElementById('retry-btn');
        this.shareBtn = document.getElementById('share-btn');
        this.premiumBtn = document.getElementById('premium-analysis-btn');

        // 모달
        this.premiumModal = document.getElementById('premium-modal');
        this.premiumBody = document.getElementById('premium-body');
        this.premiumClose = document.getElementById('premium-close');
        this.closePremiumBtn = document.getElementById('close-premium-btn');

        // 언어 선택
        this.langToggle = document.getElementById('lang-toggle');
        this.langMenu = document.getElementById('lang-menu');
        this.langOptions = document.querySelectorAll('.lang-option');
    }

    initEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);
            themeToggle.textContent = savedTheme === 'light' ? '🌙' : '☀️';
            themeToggle.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);
                themeToggle.textContent = next === 'light' ? '🌙' : '☀️';
            });
        }

        // Safe event listener attachment with null checks
        if (this.startBtn) this.startBtn.addEventListener('click', () => this.startTest());
        if (this.retryBtn) this.retryBtn.addEventListener('click', () => this.startTest());
        if (this.shareBtn) this.shareBtn.addEventListener('click', () => this.shareResult());
        if (this.premiumBtn) this.premiumBtn.addEventListener('click', () => this.showPremiumAnalysis());

        if (this.gameArea) {
            this.gameArea.addEventListener('click', () => this.onGameAreaTap());
            this.gameArea.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    this.onGameAreaTap();
                }
            });
        }

        // 언어 선택
        if (this.langToggle) {
            this.langToggle.addEventListener('click', () => {
                if (this.langMenu) this.langMenu.classList.toggle('hidden');
            });
        }

        this.langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                if (lang && window.i18n && typeof window.i18n.setLanguage === 'function') {
                    i18n.setLanguage(lang);
                    if (this.langMenu) this.langMenu.classList.add('hidden');
                }
            });
        });

        // 프리미엄 모달
        if (this.premiumClose) this.premiumClose.addEventListener('click', () => this.closePremiumModal());
        if (this.closePremiumBtn) this.closePremiumBtn.addEventListener('click', () => this.closePremiumModal());
        if (this.premiumModal) {
            this.premiumModal.addEventListener('click', (e) => {
                if (e.target === this.premiumModal) this.closePremiumModal();
            });
        }
    }

    async initI18n() {
        try {
            if (window.i18n && typeof window.i18n.init === 'function') {
                await i18n.init();
            }
        } catch (e) {
            console.warn('i18n init failed:', e.message);
        }
        this.updateLanguageButton();

        // Hide app loader after i18n is ready
        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 300);
        }
    }

    updateLanguageButton() {
        const currentLang = i18n.currentLang;
        this.langOptions.forEach(option => {
            if (option.dataset.lang === currentLang) {
                option.style.background = 'rgba(0, 200, 83, 0.2)';
            } else {
                option.style.background = 'transparent';
            }
        });
    }

    startTest() {
        this.times = [];
        this.currentRound = 0;
        this.showGameScreen();
        this.nextRound();
        // GA4 engagement on first interaction
        if (typeof gtag === 'function') {
            gtag('event', 'engagement', { event_category: 'reaction_test', event_label: 'first_interaction' });
        }
    }

    nextRound() {
        this.currentRound++;
        this.roundNumber.textContent = this.currentRound;

        if (this.currentRound > 5) {
            this.showResultScreen();
            return;
        }

        this.resetGameArea();
        this.waitForSignal();
    }

    resetGameArea() {
        this.gameArea.className = '';
        this.isActive = false;
        this.startTime = null;
        this.gameStatus.textContent = i18n.t('game.waiting');
        this.timerDisplay.textContent = '';
    }

    waitForSignal() {
        const waitTime = Math.random() * (this.maxWaitTime - this.minWaitTime) + this.minWaitTime;

        this.waitTimeout = setTimeout(() => {
            this.showSignal();
        }, waitTime);
    }

    showSignal() {
        this.gameArea.classList.add('ready');
        this.gameStatus.textContent = i18n.t('game.go');
        this.isActive = true;
        this.startTime = performance.now();
    }

    onGameAreaTap() {
        if (!this.isActive) {
            // 너무 일찍 탭한 경우
            if (this.startTime === null) {
                this.gameArea.classList.add('early-tap');
                this.gameStatus.textContent = i18n.t('game.tooEarly');

                // 재시도
                setTimeout(() => {
                    clearTimeout(this.waitTimeout);
                    this.nextRound();
                }, 1000);
            }
            return;
        }

        // 정상적인 반응
        const reactionTime = Math.round(performance.now() - this.startTime);
        this.recordTime(reactionTime);
        this.isActive = false;

        // 결과 표시
        this.gameStatus.textContent = `${reactionTime}ms`;
        this.gameArea.style.opacity = '0.8';

        setTimeout(() => {
            this.nextRound();
        }, 1000);
    }

    recordTime(time) {
        this.times.push(time);
    }

    showGameScreen() {
        this.introScreen.classList.remove('active');
        this.gameScreen.classList.add('active');
        this.resultScreen.classList.remove('active');
    }

    showResultScreen() {
        this.gameScreen.classList.remove('active');
        this.resultScreen.classList.add('active');
        this.calculateResults();
    }

    calculateResults() {
        const avgTime = Math.round(this.times.reduce((a, b) => a + b, 0) / this.times.length);
        const grade = this.getGrade(avgTime);
        const percentile = this.getPercentile(avgTime);

        // 표시
        this.avgTime.textContent = avgTime;
        this.gradeIcon.textContent = grade.icon;
        this.gradeName.textContent = i18n.t(grade.i18nKey);
        this.percentile.textContent = i18n.t('results.topPercent', { percent: percentile });

        // 측정 기록
        this.timeList.innerHTML = this.times.map((time, index) => `
            <div class="time-item">
                <div class="time-number">${time}</div>
                <div class="time-label">${i18n.t('results.round')} ${index + 1}</div>
            </div>
        `).join('');

        // Best score tracking with retry encouragement
        const bestTime = parseInt(localStorage.getItem('reaction-best') || '9999');
        if (avgTime < bestTime) {
            localStorage.setItem('reaction-best', avgTime.toString());
            const resultIcon = document.getElementById('result-icon');
            if (resultIcon) resultIcon.textContent = '🏆';
        }
        // Show best score comparison to encourage retry
        const storedBest = parseInt(localStorage.getItem('reaction-best') || avgTime.toString());
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn && avgTime > storedBest) {
            retryBtn.textContent = '🔄 ' + (i18n.t('results.retryButton') || 'Try again') + ' (Best: ' + storedBest + 'ms)';
        }

        // GA4 이벤트 추적
        if (window.gtag) {
            gtag('event', 'reaction_test_completed', {
                'average_time': avgTime,
                'grade': grade.name,
                'round_times': this.times.join(',')
            });
        }
    }

    getGrade(avgTime) {
        if (avgTime <= 150) {
            return { icon: '⚡', name: 'superhuman', i18nKey: 'grades.superhuman' };
        } else if (avgTime <= 200) {
            return { icon: '🏆', name: 'veryFast', i18nKey: 'grades.veryFast' };
        } else if (avgTime <= 250) {
            return { icon: '✨', name: 'fast', i18nKey: 'grades.fast' };
        } else if (avgTime <= 350) {
            return { icon: '👍', name: 'normal', i18nKey: 'grades.normal' };
        } else {
            return { icon: '🐢', name: 'slow', i18nKey: 'grades.slow' };
        }
    }

    getPercentile(avgTime) {
        // 실제 통계 기반 백분위수
        if (avgTime <= 150) return '1%';
        if (avgTime <= 200) return '10%';
        if (avgTime <= 250) return '30%';
        if (avgTime <= 350) return '50%';
        return '70%+';
    }

    shareResult() {
        const avgTime = Math.round(this.times.reduce((a, b) => a + b, 0) / this.times.length);
        const grade = this.getGrade(avgTime);
        const shareText = i18n.t('results.shareText', {
            avgTime: avgTime,
            gradeName: i18n.t(grade.i18nKey)
        });

        if (navigator.share) {
            navigator.share({
                title: i18n.t('results.shareTitle'),
                text: shareText,
                url: window.location.href
            });
        } else {
            // 폴백: 복사
            navigator.clipboard.writeText(shareText);
            alert(i18n.t('results.copiedToClipboard'));
        }
    }

    showPremiumAnalysis() {
        const avgTime = Math.round(this.times.reduce((a, b) => a + b, 0) / this.times.length);

        // 전면 광고 표시
        this.showInterstitialAd(() => {
            // 광고 종료 후 프리미엄 콘텐츠 표시
            const analysis = this.generateAIAnalysis(avgTime);
            this.premiumBody.innerHTML = analysis;
            this.premiumModal.classList.remove('hidden');
        });
    }

    generateAIAnalysis(avgTime) {
        const grade = this.getGrade(avgTime);
        const variance = this.calculateVariance();
        const improvement = this.suggestImprovement(avgTime);

        const analyses = {
            'superhuman': {
                type: '초인적 반응 타입',
                description: '당신은 평균을 훨씬 넘는 빠른 반응 속도를 가지고 있습니다. 이는 뛰어난 신경 전달 속도와 즉각적인 판단력을 시사합니다.',
                traits: ['극도의 집중력', '빠른 의사결정', '반사신경 우수', '스포츠/게임 재능'],
                career: ['프로 게이머', '스포츠 선수', '조종사', '외과의']
            },
            'veryFast': {
                type: '매우 빠른 반응 타입',
                description: '당신의 반응 속도는 일반인보다 훨씬 빠릅니다. 높은 신경 효율성과 좋은 집중력을 가지고 있을 가능성이 높습니다.',
                traits: ['높은 집중력', '빠른 학습능력', '좋은 반사신경', '적응력 우수'],
                career: ['프로그래머', '디자이너', '운동선수', '군인']
            },
            'fast': {
                type: '빠른 반응 타입',
                description: '당신은 평균보다 빠른 반응 속도를 보유하고 있습니다. 이는 건강한 신경계통과 좋은 주의력을 의미합니다.',
                traits: ['좋은 주의력', '민첩성', '안정적 반응', '일관된 성능'],
                career: ['전문가 직종', '관리자', '의료인', '기술자']
            },
            'normal': {
                type: '보통 반응 타입',
                description: '당신의 반응 속도는 일반적인 범위 내에 있습니다. 정상적인 신경계통 기능과 적절한 집중력을 나타냅니다.',
                traits: ['안정적 성능', '적절한 집중력', '균형잡힌 반응', '신뢰성'],
                career: ['다양한 분야 적응', '관리/조정 역할', '사무직', '교육자']
            },
            'slow': {
                type: '느린 반응 타입',
                description: '당신의 반응 속도는 평균보다 느립니다. 이는 피로, 스트레스, 또는 집중력 산만이 원인일 수 있습니다.',
                traits: ['신중한 판단', '깊은 사고력', '신뢰성 있는 성능', '체계적 접근'],
                traits_alt: ['피로/스트레스 상태', '산만한 주의력', '낮은 신경 효율'],
                career: ['분석가', '연구자', '이론가', '계획가'],
                improvement: '충분한 수면과 휴식, 명상이나 운동을 통한 스트레스 해소가 반응 속도 향상에 도움이 될 수 있습니다.'
            }
        };

        const data = analyses[grade.name] || analyses['normal'];

        return `
            <div class="analysis-section">
                <div class="analysis-title">${i18n.t('premium.reactionType')}</div>
                <div class="analysis-content">
                    <strong>${data.type}</strong><br>
                    ${data.description}
                </div>
            </div>

            <div class="analysis-section">
                <div class="analysis-title">${i18n.t('premium.personalityTraits')}</div>
                <div class="analysis-content">
                    <ul style="margin: 0; padding-left: 20px;">
                        ${data.traits.map(trait => `<li>${trait}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="analysis-section">
                <div class="analysis-title">${i18n.t('premium.suitableCareers')}</div>
                <div class="analysis-content">
                    ${data.career.join(', ')}
                </div>
            </div>

            ${data.improvement ? `
                <div class="analysis-section">
                    <div class="analysis-title">${i18n.t('premium.improvement')}</div>
                    <div class="analysis-content">
                        ${data.improvement}
                    </div>
                </div>
            ` : ''}

            <div class="analysis-section">
                <div class="analysis-title">${i18n.t('premium.dataAnalysis')}</div>
                <div class="analysis-content">
                    ${i18n.t('premium.averageTime')}: ${avgTime}ms<br>
                    ${i18n.t('premium.variance')}: ${variance}ms<br>
                    ${i18n.t('premium.consistency')}: ${this.getConsistency(variance)}
                </div>
            </div>
        `;
    }

    calculateVariance() {
        const avg = this.times.reduce((a, b) => a + b, 0) / this.times.length;
        const variance = Math.sqrt(
            this.times.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / this.times.length
        );
        return Math.round(variance);
    }

    getConsistency(variance) {
        if (variance < 20) return i18n.t('premium.veryConsistent');
        if (variance < 50) return i18n.t('premium.consistent');
        if (variance < 100) return i18n.t('premium.somewhat');
        return i18n.t('premium.inconsistent');
    }

    suggestImprovement(avgTime) {
        if (avgTime > 350) {
            return i18n.t('premium.improvementSuggestion');
        }
        return '';
    }

    showInterstitialAd(callback) {
        const adOverlay = document.getElementById('interstitial-ad');
        const closeBtn = document.getElementById('close-ad');
        const countdown = document.getElementById('countdown');

        adOverlay.classList.remove('hidden');
        closeBtn.disabled = true;

        let countdownTime = 5;
        const interval = setInterval(() => {
            countdownTime--;
            countdown.textContent = countdownTime;

            if (countdownTime <= 0) {
                clearInterval(interval);
                closeBtn.disabled = false;
            }
        }, 1000);

        closeBtn.addEventListener('click', () => {
            clearInterval(interval);
            adOverlay.classList.add('hidden');
            if (callback) callback();
        });
    }

    closePremiumModal() {
        this.premiumModal.classList.add('hidden');
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    const app = new ReactionTest();
    initSoundToggle();
});

// GA4 engagement tracking (scroll + timer)
(function() {
    let scrollFired = false;
    window.addEventListener('scroll', function() {
        if (!scrollFired && window.scrollY > 100) {
            scrollFired = true;
            if (typeof gtag === 'function') gtag('event', 'scroll_engagement', { engagement_type: 'scroll' });
        }
    }, { passive: true });
    setTimeout(function() {
        if (typeof gtag === 'function') gtag('event', 'timer_engagement', { engagement_time_msec: 5000 });
    }, 5000);
})();

// Sound toggle functionality
function initSoundToggle() {
    const btn = document.getElementById('sound-toggle');
    if (!btn || !window.sfx) return;

    btn.textContent = window.sfx.enabled ? '🔊' : '🔇';
    btn.addEventListener('click', () => {
        window.sfx.toggle();
        btn.textContent = window.sfx.enabled ? '🔊' : '🔇';
    });
}
