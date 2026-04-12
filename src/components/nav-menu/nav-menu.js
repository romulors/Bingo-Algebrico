export function parseHash(hash) {
	const raw = (hash || "").replace(/^#/, "");

	if (!raw) {
		return { screen: "", params: {} };
	}

	const [screenPart, query] = raw.split("?");
	const params = {};

	if (query) {
		const pairs = new URLSearchParams(query);
		for (const [key, value] of pairs.entries()) {
			params[key] = value;
		}
	}

	return { screen: screenPart, params };
}

export function createNavMenu({ elements, state, saveState, onCartelasModeChange }) {
	function navigateTo(screenName) {
		state.currentScreen = screenName;

		if (elements.navItems) {
			elements.navItems.forEach((item) => {
				const isActive = item.dataset.target === screenName;
				item.classList.toggle("active", isActive);
				if (isActive) {
					item.setAttribute("aria-current", "page");
				} else {
					item.removeAttribute("aria-current");
				}
			});
		}

		if (elements.screens) {
			elements.screens.forEach((screen) => {
				const show = screen.dataset.screen === screenName;
				screen.classList.toggle("active", show);
				screen.setAttribute("aria-hidden", show ? "false" : "true");
			});
		}

		if (elements.screens) {
			const activeScreen = elements.screens.find((screen) => screen.dataset.screen === screenName);
			if (activeScreen) {
				const focusTarget = activeScreen.querySelector("h2") || activeScreen.querySelector("button, [tabindex], a, input, select, textarea");
				if (focusTarget) {
					if (!focusTarget.hasAttribute("tabindex")) {
						focusTarget.setAttribute("tabindex", "-1");
					}
					focusTarget.focus();
				}
			}
		}

		if (screenName !== "restricoes") {
			state.focusedRestrictionEquationId = "";
		}

		saveState(state);
	}

	function pushScreen(screenName) {
		navigateTo(screenName);
		try {
			history.pushState({ screen: screenName }, "", `#${screenName}`);
		} catch (error) {
			location.hash = `#${screenName}`;
		}
	}

	function onHashChange() {
		const { screen, params } = parseHash(location.hash);
		if (screen && screen !== state.currentScreen) {
			navigateTo(screen);
		}
		if (params.mode && screen === "cartelas" && onCartelasModeChange) {
			onCartelasModeChange(params.mode);
		}
	}

	function setup() {
		if (!elements.navMenu) {
			return;
		}

		elements.navMenu.addEventListener("click", (event) => {
			if (event.defaultPrevented) return;
			event.preventDefault();

			const item = event.target.closest?.(".nav-menu-item");
			if (!item || !elements.navMenu.contains(item)) return;

			const target = item.dataset.target;
			if (target) {
				pushScreen(target);
			}
		});

		elements.navMenu.addEventListener("keydown", (event) => {
			if (event.key !== "Enter" && event.key !== " ") {
				return;
			}

			const item = event.target.closest?.(".nav-menu-item");
			if (!item) {
				return;
			}

			event.preventDefault();
			const target = item.dataset.target;
			if (target) {
				pushScreen(target);
			}
		});

		window.addEventListener("hashchange", onHashChange);

		if (elements.botaoIrTopicos) {
			elements.botaoIrTopicos.addEventListener("click", () => pushScreen("topicos"));
		}

		if (elements.botaoIrPresets) {
			elements.botaoIrPresets.addEventListener("click", () => pushScreen("presets"));
		}
	}

	return {
		navigateTo,
		pushScreen,
		setup
	};
}