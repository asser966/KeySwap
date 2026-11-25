const initialRows = [
  [['Esc', 'Esc', '', 'utility'], ['F1', 'F1', '', 'utility'], ['F2', 'F2', '', 'utility'], ['F3', 'F3', '', 'utility'], ['F4', 'F4', '', 'utility'], ['F5', 'F5', '', 'utility'], ['F6', 'F6', '', 'utility'], ['F7', 'F7', '', 'utility'], ['F8', 'F8', '', 'utility'], ['F9', 'F9', '', 'utility'], ['F10', 'F10', '', 'utility'], ['F11', 'F11', '', 'utility'], ['F12', 'F12', '', 'utility'], ['Print', 'PrtSc', '', 'utility'], ['Scroll', 'ScrLk', '', 'utility'], ['Pause', 'Pause', '', 'utility']],
  [['Backquote', '`', '~'], ['Digit1', '1', '!'], ['Digit2', '2', '@'], ['Digit3', '3', '#'], ['Digit4', '4', '$'], ['Digit5', '5', '%'], ['Digit6', '6', '^'], ['Digit7', '7', '&'], ['Digit8', '8', '*'], ['Digit9', '9', '('], ['Digit0', '0', ')'], ['Minus', '-', '_'], ['Equal', '=', '+'], ['Backspace', 'Backspace', '', 'utility width-2']],
  [['Tab', 'Tab', '', 'utility width-1-5'], ['KeyQ', 'Q'], ['KeyW', 'W'], ['KeyE', 'E'], ['KeyR', 'R'], ['KeyT', 'T'], ['KeyY', 'Y'], ['KeyU', 'U'], ['KeyI', 'I'], ['KeyO', 'O'], ['KeyP', 'P'], ['BracketLeft', '[', '{'], ['BracketRight', ']', '}'], ['Backslash', '\\', '|', 'width-1-5']],
  [['CapsLock', 'Caps Lock', '', 'utility width-1-75'], ['KeyA', 'A'], ['KeyS', 'S'], ['KeyD', 'D'], ['KeyF', 'F'], ['KeyG', 'G'], ['KeyH', 'H'], ['KeyJ', 'J'], ['KeyK', 'K'], ['KeyL', 'L'], ['Semicolon', ';', ':'], ['Quote', "'", '"'], ['Enter', 'Enter', '', 'utility width-2-25']],
  [['ShiftLeft', 'Shift', '', 'utility width-2-25'], ['KeyZ', 'Z'], ['KeyX', 'X'], ['KeyC', 'C'], ['KeyV', 'V'], ['KeyB', 'B'], ['KeyN', 'N'], ['KeyM', 'M'], ['Comma', ',', '<'], ['Period', '.', '>'], ['Slash', '/', '?'], ['ShiftRight', 'Shift', '', 'utility width-2-75']],
  [['ControlLeft', 'Ctrl', '', 'utility width-1-25'], ['MetaLeft', 'Win', '', 'utility width-1-25'], ['AltLeft', 'Alt', '', 'utility width-1-25'], ['Space', 'Space', '', 'utility width-6'], ['AltRight', 'Alt', '', 'utility width-1-25'], ['MetaRight', 'Win', '', 'utility width-1-25'], ['ContextMenu', 'Menu', '', 'utility width-1-25'], ['ControlRight', 'Ctrl', '', 'utility width-1-25']]
];

const languages = {
  'en-US': { name: 'US · QWERTY', keys: {} },
  'en-GB': {
    name: 'UK · QWERTY',
    keys: {
      Backquote: ['¬', '¦'], Digit2: ['2', '"'], Digit3: ['3', '£'],
      Quote: ["'", '@'], Backslash: ['#', '~']
    }
  },
  'de-DE': {
    name: 'DE · QWERTZ',
    keys: {
      Backquote: ['^', '°'], Digit2: ['2', '"'], Digit3: ['3', '§'],
      Digit6: ['6', '&'], Digit7: ['7', '/'], Digit8: ['8', '('],
      Digit9: ['9', ')'], Digit0: ['0', '='], Minus: ['ß', '?'], Equal: ['´', '`'],
      KeyY: ['Z', ''], KeyZ: ['Y', ''],
      BracketLeft: ['ü', 'Ü'], BracketRight: ['+', '*'], Backslash: ['#', "'"],
      Semicolon: ['ö', 'Ö'], Quote: ['ä', 'Ä'],
      Comma: [',', ';'], Period: ['.', ':'], Slash: ['-', '_']
    }
  },
  'fr-FR': {
    name: 'FR · AZERTY',
    keys: {
      Backquote: ['²', ''], Digit1: ['&', '1'], Digit2: ['é', '2'],
      Digit3: ['"', '3'], Digit4: ["'", '4'], Digit5: ['(', '5'],
      Digit6: ['-', '6'], Digit7: ['è', '7'], Digit8: ['_', '8'],
      Digit9: ['ç', '9'], Digit0: ['à', '0'], Minus: [')', '°'], Equal: ['=', '+'],
      KeyQ: ['A', ''], KeyA: ['Q', ''], KeyW: ['Z', ''], KeyZ: ['W', ''],
      BracketLeft: ['^', '¨'], BracketRight: ['$', '£'], Backslash: ['*', 'µ'],
      Semicolon: ['M', ''], Quote: ['ù', '%'],
      KeyM: [',', '?'], Comma: [';', '.'], Period: [':', '/'], Slash: ['!', '§']
    }
  },
  'es-ES': {
    name: 'ES · QWERTY',
    keys: {
      Backquote: ['º', 'ª'], Digit2: ['2', '"'], Digit3: ['3', '·'],
      Digit6: ['6', '&'], Digit7: ['7', '/'], Digit8: ['8', '('],
      Digit9: ['9', ')'], Digit0: ['0', '='], Minus: ["'", '?'], Equal: ['¡', '¿'],
      BracketLeft: ['´', '¨'], BracketRight: ['+', '*'], Backslash: ['ç', 'Ç'],
      Semicolon: ['ñ', 'Ñ'], Quote: ['´', '¨'],
      Comma: [',', ';'], Period: ['.', ':'], Slash: ['-', '_']
    }
  },
  'it-IT': {
    name: 'IT · QWERTY',
    keys: {
      Backquote: ['\\', '|'], Digit2: ['2', '"'], Digit3: ['3', '£'],
      Digit4: ['4', '$'], Digit6: ['6', '&'], Digit7: ['7', '/'],
      Digit8: ['8', '('], Digit9: ['9', ')'], Digit0: ['0', '='],
      Minus: ["'", '?'], Equal: ['ì', '^'],
      BracketLeft: ['è', 'é'], BracketRight: ['+', '*'], Backslash: ['ù', '§'],
      Semicolon: ['ò', 'ç'], Quote: ['à', '°'],
      Comma: [',', ';'], Period: ['.', ':'], Slash: ['-', '_']
    }
  },
  'nl-NL': {
    name: 'NL · US-INTL',
    keys: {
      BracketLeft: ['¨', '^'], BracketRight: ['[', '{'], Backslash: [']', '}'],
      Quote: ["'", '"'], Semicolon: [';', ':']
    }
  },
  'sv-SE': {
    name: 'SE · QWERTY',
    keys: {
      Backquote: ['§', '½'], Digit2: ['2', '"'], Digit4: ['4', '¤'],
      Digit7: ['7', '/'], Digit8: ['8', '('], Digit9: ['9', ')'],
      Digit0: ['0', '='], Minus: ['+', '?'], Equal: ['´', '~'],
      BracketLeft: ['å', 'Å'], BracketRight: ['¨', '^'], Backslash: ['*', "'"],
      Semicolon: ['ö', 'Ö'], Quote: ['ä', 'Ä'],
      Comma: [',', ';'], Period: ['.', ':'], Slash: ['-', '_']
    }
  },
  'pt-BR': {
    name: 'BR · ABNT2 MAP',
    keys: {
      Backquote: ["'", '"'], Digit2: ['2', '@'], Digit3: ['3', '#'],
      Digit6: ['6', '¨'], Digit7: ['7', '&'], Digit8: ['8', '*'],
      Digit9: ['9', '('], Digit0: ['0', ')'], Minus: ['-', '_'], Equal: ['=', '+'],
      BracketLeft: ['´', '`'], BracketRight: ['[', '{'], Backslash: [']', '}'],
      Semicolon: ['ç', 'Ç'], Quote: ['~', '^'],
      Comma: [',', '<'], Period: ['.', '>'], Slash: [';', ':']
    }
  },
  'ar-SA': {
    name: 'AR · ARABIC 101',
    direction: 'rtl',
    keys: {
      Backquote: ['ذ', 'ّ'], KeyQ: ['ض', 'َ'], KeyW: ['ص', 'ً'], KeyE: ['ث', 'ُ'],
      KeyR: ['ق', 'ٌ'], KeyT: ['ف', 'لإ'], KeyY: ['غ', 'إ'], KeyU: ['ع', '‘'],
      KeyI: ['ه', '÷'], KeyO: ['خ', '×'], KeyP: ['ح', '؛'],
      BracketLeft: ['ج', '<'], BracketRight: ['د', '>'], Backslash: ['\\', '|'],
      KeyA: ['ش', 'ِ'], KeyS: ['س', 'ٍ'], KeyD: ['ي', ']'], KeyF: ['ب', '['],
      KeyG: ['ل', 'لأ'], KeyH: ['ا', 'أ'], KeyJ: ['ت', 'ـ'], KeyK: ['ن', '،'],
      KeyL: ['م', '/'], Semicolon: ['ك', ':'], Quote: ['ط', '"'],
      KeyZ: ['ئ', '~'], KeyX: ['ء', 'ْ'], KeyC: ['ؤ', '}'], KeyV: ['ر', '{'],
      KeyB: ['لا', 'لآ'], KeyN: ['ى', 'آ'], KeyM: ['ة', '’'],
      Comma: ['و', ','], Period: ['ز', '.'], Slash: ['ظ', '؟']
    }
  }
};

const themes = {
  midnight: 'Midnight',
  sage: 'Sage',
  paper: 'Paper',
  ocean: 'Ocean',
  amethyst: 'Amethyst',
  ember: 'Ember',
  slate: 'Slate',
  rose: 'Rose',
  'high-contrast': 'High contrast'
};

const storageKey = 'keyswap-layout-v1';
const keyboard = document.querySelector('#keyboard');
const form = document.querySelector('#assignment-form');
const mainInput = document.querySelector('#main-legend');
const altInput = document.querySelector('#alt-legend');
const applyButton = document.querySelector('#apply-assignment');
const selectedPreview = document.querySelector('#selected-preview');
const selectedName = document.querySelector('#selected-name');
const selectedPosition = document.querySelector('#selected-position');
const saveStatus = document.querySelector('#save-status');
const toast = document.querySelector('#toast');
const languageSelect = document.querySelector('#language-select');
const themeSelect = document.querySelector('#theme-select');
const layoutTitle = document.querySelector('#layout-title');
const accountButton = document.querySelector('#account-button');
const cloudMessage = document.querySelector('#cloud-message');
const planStatus = document.querySelector('#plan-status');
const saveLayoutForm = document.querySelector('#save-layout-form');
const saveLayoutName = document.querySelector('#save-layout-name');
const saveLayoutButton = document.querySelector('#save-layout-button');
const savedLayoutsElement = document.querySelector('#saved-layouts');
const upgradeButton = document.querySelector('#upgrade-button');
const managePlanButton = document.querySelector('#manage-plan-button');
const applySystemLayoutButton = document.querySelector('#apply-system-layout');
const stopSystemRemapButton = document.querySelector('#stop-system-remap');
const systemRemapStatus = document.querySelector('#system-remap-status');
const authDialog = document.querySelector('#auth-dialog');
const authTitle = document.querySelector('#auth-title');
const authConfigMessage = document.querySelector('#auth-config-message');
const authForm = document.querySelector('#auth-form');
const authEmail = document.querySelector('#auth-email');
const authPassword = document.querySelector('#auth-password');
const authSubmit = document.querySelector('#auth-submit');
const authMessage = document.querySelector('#auth-message');
const signInTab = document.querySelector('#sign-in-tab');
const signUpTab = document.querySelector('#sign-up-tab');
const googleAuthButton = document.querySelector('#google-auth-button');
const appleAuthButton = document.querySelector('#apple-auth-button');
const authLoginPanel = document.querySelector('#auth-login-panel');
const accountSessionPanel = document.querySelector('#account-session-panel');
const accountEmail = document.querySelector('#account-email');
const signOutButton = document.querySelector('#sign-out-button');
const mfaStatus = document.querySelector('#mfa-status');
const mfaFactorLabel = document.querySelector('#mfa-factor-label');
const mfaFactorSelect = document.querySelector('#mfa-factor-select');
const enrollMfaButton = document.querySelector('#enroll-mfa-button');
const mfaEnrollForm = document.querySelector('#mfa-enroll-form');
const mfaQrCode = document.querySelector('#mfa-qr-code');
const mfaSecret = document.querySelector('#mfa-secret');
const mfaEnrollCode = document.querySelector('#mfa-enroll-code');
const cancelMfaEnrollmentButton = document.querySelector('#cancel-mfa-enrollment');
const mfaChallengeForm = document.querySelector('#mfa-challenge-form');
const mfaChallengeCode = document.querySelector('#mfa-challenge-code');
const removeMfaButton = document.querySelector('#remove-mfa-button');
const supabaseConfig = window.KEYSWAP_CONFIG || {};
let supabaseClient = null;
let cloudConfigError = '';
let session = null;
let subscription = null;
let savedLayouts = [];
let assuranceLevel = 'aal1';
let verifiedMfaFactors = [];
let selectedMfaFactorId = null;
let pendingEnrollmentFactorId = null;
let mfaPromptedUserId = null;
let authMode = 'sign-in';
let cloudRefreshId = 0;
const savedState = loadState();
let language = savedState.language;
let theme = savedState.theme;
let layouts = savedState.layouts;
let layout = layouts[language];
let selectedId = null;
let toastTimer;

function cloneInitialLayout() {
  return initialRows.map(row => row.map(([id, main, alt = '', style = '']) => ({ id, main, alt, style })));
}

function createLanguageLayout(languageCode) {
  const result = cloneInitialLayout();
  for (const [id, [main, alt]] of Object.entries(languages[languageCode].keys)) {
    const key = result.flat().find(candidate => candidate.id === id);
    key.main = main;
    key.alt = alt;
  }
  return result;
}

function createDefaultLayouts() {
  return Object.fromEntries(Object.keys(languages).map(code => [code, createLanguageLayout(code)]));
}

function isValidLayout(rows) {
  return Array.isArray(rows) &&
    rows.length === initialRows.length &&
    rows.every((row, rowIndex) => Array.isArray(row) &&
      row.length === initialRows[rowIndex].length &&
      row.every((key, keyIndex) => key.id === initialRows[rowIndex][keyIndex][0] &&
        typeof key.main === 'string' && typeof key.alt === 'string'));
}

function loadState() {
  const defaults = () => ({ language: 'en-US', theme: 'midnight', layouts: createDefaultLayouts() });
  let saved;
  try {
    saved = localStorage.getItem(storageKey);
  } catch {
    saveStatus.textContent = 'Local saving unavailable';
    return defaults();
  }
  if (!saved) return defaults();
  try {
    const parsed = JSON.parse(saved);
    if (isValidLayout(parsed)) {
      const migrated = defaults();
      migrated.layouts['en-US'] = parsed;
      return migrated;
    }
    const isValidState = parsed && parsed.version === 2 &&
      Object.keys(languages).includes(parsed.language) &&
      Object.keys(themes).includes(parsed.theme) &&
      parsed.layouts && typeof parsed.layouts === 'object' &&
      Object.entries(parsed.layouts).every(([code, rows]) =>
        Object.keys(languages).includes(code) && isValidLayout(rows));
    if (isValidState) {
      return { ...defaults(), language: parsed.language, theme: parsed.theme, layouts: { ...createDefaultLayouts(), ...parsed.layouts } };
    }
    saveStatus.textContent = 'Saved layout unreadable';
    return defaults();
  } catch {
    saveStatus.textContent = 'Saved layout unreadable';
    return defaults();
  }
}

function getKey(id) {
  return layout.flat().find(key => key.id === id);
}

function renderKeyboard() {
  keyboard.replaceChildren();
  keyboard.classList.toggle('rtl-legends', languages[language].direction === 'rtl');
  for (const row of layout) {
    const rowElement = document.createElement('div');
    rowElement.className = 'key-row';
    for (const keyData of row) {
      const key = document.createElement('button');
      key.type = 'button';
      key.className = `key ${keyData.style || ''}${selectedId === keyData.id ? ' selected' : ''}`;
      key.dataset.keyId = keyData.id;
      key.setAttribute('aria-label', `${keyData.id}: ${keyData.main}${keyData.alt ? `, alternate ${keyData.alt}` : ''}`);
      key.setAttribute('aria-pressed', selectedId === keyData.id ? 'true' : 'false');
      const alt = document.createElement('span');
      alt.className = 'alt-legend';
      alt.textContent = keyData.alt;
      const main = document.createElement('span');
      main.className = 'legend';
      main.textContent = keyData.main;
      key.append(alt, main);
      key.addEventListener('click', () => selectKey(keyData.id));
      rowElement.append(key);
    }
    keyboard.append(rowElement);
  }
  document.querySelector('#key-count').textContent = layout.flat().length;
}

function getPhysicalKeyId(code) {
  const aliases = { Escape: 'Esc', PrintScreen: 'Print', ScrollLock: 'Scroll' };
  const id = aliases[code] || code;
  return getKey(id) ? id : null;
}

function isEditableFocus() {
  const active = document.activeElement;
  return active instanceof HTMLElement &&
    (active.isContentEditable || active.matches('input, textarea, select, [role="textbox"]'));
}

function setPhysicalKeyPressed(event, pressed) {
  if (pressed && isEditableFocus()) return;
  const id = getPhysicalKeyId(event.code);
  if (!id) return;
  const key = Array.from(keyboard.querySelectorAll('.key')).find(element => element.dataset.keyId === id);
  if (key) key.classList.toggle('pressed', pressed);
}

function selectKey(id) {
  if (selectedId && selectedId !== id) {
    const first = getKey(selectedId);
    const second = getKey(id);
    [first.main, second.main] = [second.main, first.main];
    [first.alt, second.alt] = [second.alt, first.alt];
    persistLayout();
    selectedId = null;
    updateEditor();
    renderKeyboard();
    showToast(`Swapped ${first.id} and ${second.id}`);
    return;
  }
  selectedId = id;
  updateEditor();
  renderKeyboard();
}

function updateEditor() {
  const key = selectedId ? getKey(selectedId) : null;
  const enabled = Boolean(key);
  mainInput.disabled = !enabled;
  altInput.disabled = !enabled;
  applyButton.disabled = !enabled;
  if (!key) {
    selectedPreview.textContent = '—';
    selectedName.textContent = 'Choose a key';
    selectedPosition.textContent = 'Click any key on the layout';
    mainInput.value = '';
    altInput.value = '';
    return;
  }
  selectedPreview.textContent = key.main || '·';
  selectedName.textContent = key.main || 'Unassigned';
  selectedPosition.textContent = key.id.replace(/([a-z])([A-Z])/g, '$1 $2');
  mainInput.value = key.main;
  altInput.value = key.alt;
}

function persistLayout() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ version: 2, language, theme, layouts }));
    saveStatus.textContent = 'Saved locally';
  } catch {
    saveStatus.textContent = 'Could not save';
    showToast('Could not save your layout in this browser.');
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2100);
}

function setCloudMessage(message) {
  cloudMessage.textContent = message;
}

function isProPlan() {
  return Boolean(subscription && ['active', 'trialing'].includes(subscription.status));
}

function renderSavedLayouts() {
  savedLayoutsElement.replaceChildren();
  for (const saved of savedLayouts) {
    const item = document.createElement('article');
    item.className = 'saved-layout-item';
    const meta = document.createElement('div');
    meta.className = 'saved-layout-meta';
    const name = document.createElement('strong');
    name.textContent = saved.name;
    const details = document.createElement('span');
    details.textContent = languages[saved.language]?.name || saved.language;
    meta.append(name, details);

    const actions = document.createElement('div');
    actions.className = 'saved-layout-actions';
    const loadButton = document.createElement('button');
    loadButton.type = 'button';
    loadButton.textContent = 'Load';
    loadButton.addEventListener('click', () => loadSavedLayout(saved));
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-saved-layout';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteSavedLayout(saved.id));
    actions.append(loadButton, deleteButton);
    item.append(meta, actions);
    savedLayoutsElement.append(item);
  }
}

function updateCloudUi() {
  const signedIn = Boolean(session?.user);
  const paid = isProPlan();
  const canUseCloud = signedIn && assuranceLevel === 'aal2';
  accountButton.textContent = signedIn ? 'Account' : 'Sign in / Sign up';
  accountButton.title = signedIn ? `Account for ${session.user.email || 'user'}` : 'Sign in or create an account';
  authTitle.textContent = signedIn ? 'Account security' : authMode === 'sign-up' ? 'Create your account' : 'Welcome back';
  authLoginPanel.hidden = signedIn;
  accountSessionPanel.hidden = !signedIn;
  accountEmail.textContent = signedIn ? `Signed in as ${session.user.email || 'user'}` : '';
  planStatus.textContent = paid
    ? `Pro plan · ${savedLayouts.length} saved`
    : `Free plan · ${savedLayouts.length} / 5 saved`;
  saveLayoutButton.disabled = !supabaseClient || !canUseCloud || (!paid && savedLayouts.length >= 5);
  upgradeButton.disabled = !supabaseClient || !canUseCloud || paid;
  upgradeButton.textContent = paid ? 'Pro plan active' : 'Upgrade to Pro';
  managePlanButton.hidden = !signedIn || !subscription?.stripe_customer_id;
  managePlanButton.disabled = !supabaseClient || !canUseCloud;
  authConfigMessage.hidden = Boolean(supabaseClient);
  authConfigMessage.textContent = cloudConfigError;
  authSubmit.disabled = !supabaseClient || signedIn;
  authEmail.disabled = !supabaseClient || signedIn;
  authPassword.disabled = !supabaseClient || signedIn;
  googleAuthButton.disabled = !supabaseClient || signedIn;
  appleAuthButton.disabled = !supabaseClient || signedIn;
  renderMfaControls();
  renderSavedLayouts();
}

function renderMfaControls() {
  const signedIn = Boolean(session?.user);
  if (!signedIn) return;

  const previousSelection = selectedMfaFactorId;
  mfaFactorSelect.replaceChildren();
  for (const factor of verifiedMfaFactors) {
    const option = document.createElement('option');
    option.value = factor.id;
    option.textContent = factor.friendly_name || 'Authenticator app';
    mfaFactorSelect.append(option);
  }
  selectedMfaFactorId = verifiedMfaFactors.some(factor => factor.id === previousSelection)
    ? previousSelection
    : verifiedMfaFactors[0]?.id || null;
  if (selectedMfaFactorId) mfaFactorSelect.value = selectedMfaFactorId;

  const hasFactor = verifiedMfaFactors.length > 0;
  const hasAal2 = assuranceLevel === 'aal2';
  mfaFactorLabel.hidden = verifiedMfaFactors.length < 2;
  enrollMfaButton.hidden = hasFactor || Boolean(pendingEnrollmentFactorId);
  enrollMfaButton.disabled = !supabaseClient;
  mfaEnrollForm.hidden = !pendingEnrollmentFactorId;
  mfaChallengeForm.hidden = !hasFactor || hasAal2;
  removeMfaButton.hidden = !hasFactor || !hasAal2;

  if (hasAal2) {
    mfaStatus.textContent = 'Authenticator verified. Protected cloud saves and billing are unlocked.';
  } else if (hasFactor) {
    mfaStatus.textContent = 'Enter a current authenticator code to unlock protected account actions.';
  } else if (pendingEnrollmentFactorId) {
    mfaStatus.textContent = 'Scan this one-time setup code, then verify a code from your authenticator app.';
  } else {
    mfaStatus.textContent = 'Set up an authenticator app to unlock account saves and billing. Local editing remains available.';
  }
}

async function refreshCloudData() {
  const requestId = ++cloudRefreshId;
  if (!supabaseClient) {
    updateCloudUi();
    setCloudMessage(`${cloudConfigError} Local editing remains available; account saving and billing are not connected.`);
    return;
  }

  try {
    const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
    if (sessionError) throw sessionError;
    if (requestId !== cloudRefreshId) return;
    session = sessionData.session;
    if (!session) {
      subscription = null;
      savedLayouts = [];
      assuranceLevel = 'aal1';
      verifiedMfaFactors = [];
      selectedMfaFactorId = null;
      mfaPromptedUserId = null;
      pendingEnrollmentFactorId = null;
      mfaQrCode.removeAttribute('src');
      mfaSecret.textContent = '';
      mfaEnrollCode.value = '';
      updateCloudUi();
      setCloudMessage('Sign in to save named layouts to your account. Free accounts can save up to five.');
      return;
    }

    assuranceLevel = 'aal1';
    subscription = null;
    savedLayouts = [];
    updateCloudUi();
    if (!supabaseClient.auth.mfa)
      throw new Error('This Supabase client does not support MFA. Update the app package and try again.');
    const [assuranceResult, factorsResult] = await Promise.all([
      supabaseClient.auth.mfa.getAuthenticatorAssuranceLevel(),
      supabaseClient.auth.mfa.listFactors()
    ]);
    if (requestId !== cloudRefreshId) return;
    if (assuranceResult.error) throw assuranceResult.error;
    if (factorsResult.error) throw factorsResult.error;
    assuranceLevel = assuranceResult.data.currentLevel || 'aal1';
    verifiedMfaFactors = (factorsResult.data.totp || []).filter(factor => factor.status === 'verified');
    updateCloudUi();

    if (assuranceLevel !== 'aal2') {
      subscription = null;
      savedLayouts = [];
      updateCloudUi();
      const needsChallenge = verifiedMfaFactors.length > 0;
      setCloudMessage(needsChallenge
        ? 'Verify your authenticator code before using cloud saves or billing.'
        : 'Set up an authenticator app before using cloud saves or billing. Local editing remains available.');
      if (mfaPromptedUserId !== session.user.id) {
        mfaPromptedUserId = session.user.id;
        if (!authDialog.open) authDialog.showModal();
      }
      return;
    }

    mfaPromptedUserId = null;
    const [layoutsResult, subscriptionResult] = await Promise.all([
      supabaseClient.from('saved_layouts')
        .select('id, name, language, layout, created_at')
        .order('created_at', { ascending: false }),
      supabaseClient.from('subscriptions')
        .select('status, stripe_customer_id, current_period_end, cancel_at_period_end')
        .eq('user_id', session.user.id)
        .maybeSingle()
    ]);
    if (requestId !== cloudRefreshId) return;
    if (layoutsResult.error) throw layoutsResult.error;
    if (subscriptionResult.error) throw subscriptionResult.error;
    savedLayouts = layoutsResult.data || [];
    subscription = subscriptionResult.data;
    updateCloudUi();
    const paid = isProPlan();
    setCloudMessage(paid
      ? 'Pro subscription active. Your saved layouts sync to this account.'
      : savedLayouts.length >= 5
        ? 'Free plan limit reached. Upgrade to Pro to save more layouts.'
        : 'Free plan: five saved layouts. Your current editor state also saves locally.');
  } catch (error) {
    if (requestId !== cloudRefreshId) return;
    subscription = null;
    savedLayouts = [];
    updateCloudUi();
    const message = `Could not load your account data: ${error.message || 'Check Supabase setup.'}`;
    if (session) mfaStatus.textContent = message;
    setCloudMessage(message);
  }
}

function setAuthMode(mode) {
  authMode = mode;
  const signingUp = mode === 'sign-up';
  document.querySelector('#auth-title').textContent = signingUp ? 'Create your account' : 'Welcome back';
  authSubmit.textContent = signingUp ? 'Create account' : 'Sign in';
  authPassword.autocomplete = signingUp ? 'new-password' : 'current-password';
  signInTab.setAttribute('aria-pressed', String(!signingUp));
  signUpTab.setAttribute('aria-pressed', String(signingUp));
  authMessage.textContent = '';
}

function clearMfaEnrollmentUi() {
  pendingEnrollmentFactorId = null;
  mfaQrCode.removeAttribute('src');
  mfaSecret.textContent = '';
  mfaEnrollCode.value = '';
  renderMfaControls();
}

async function beginMfaEnrollment() {
  if (!supabaseClient || !session) return;
  enrollMfaButton.disabled = true;
  mfaStatus.textContent = 'Preparing authenticator setup…';
  try {
    const { data, error } = await supabaseClient.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'KeySwap authenticator',
      issuer: 'KeySwap'
    });
    if (error) throw error;
    pendingEnrollmentFactorId = data.id;
    if (!data.totp?.qr_code || !data.totp?.secret ||
        !data.totp.qr_code.startsWith('data:image/svg+xml')) {
      throw new Error('Supabase did not return a valid authenticator QR code.');
    }
    mfaQrCode.src = data.totp.qr_code;
    mfaSecret.textContent = data.totp.secret;
    renderMfaControls();
    mfaEnrollCode.focus();
  } catch (error) {
    renderMfaControls();
    mfaStatus.textContent = `Could not prepare authenticator setup: ${error.message || 'Check Supabase MFA settings.'}`;
  } finally {
    enrollMfaButton.disabled = false;
  }
}

async function cancelMfaEnrollment() {
  const factorId = pendingEnrollmentFactorId;
  if (!factorId) return;
  clearMfaEnrollmentUi();
  cancelMfaEnrollmentButton.disabled = true;
  let cancellationError = '';
  try {
    const { error } = await supabaseClient.auth.mfa.unenroll({ factorId });
    if (error) throw error;
  } catch (error) {
    cancellationError = `Could not remove the incomplete authenticator setup: ${error.message || 'Try again.'}`;
  } finally {
    cancelMfaEnrollmentButton.disabled = false;
    await refreshCloudData();
    if (cancellationError) {
      mfaStatus.textContent = cancellationError;
      setCloudMessage(cancellationError);
    }
  }
}

async function verifyMfaCode(factorId, code) {
  const { data: challenge, error: challengeError } = await supabaseClient.auth.mfa.challenge({ factorId });
  if (challengeError) throw challengeError;
  const { error } = await supabaseClient.auth.mfa.verify({
    factorId,
    challengeId: challenge.id,
    code
  });
  if (error) throw error;
}

async function verifyMfaEnrollment(event) {
  event.preventDefault();
  if (!pendingEnrollmentFactorId || !supabaseClient) return;
  const factorId = pendingEnrollmentFactorId;
  const code = mfaEnrollCode.value.trim();
  const submitButton = mfaEnrollForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  mfaStatus.textContent = 'Verifying authenticator code…';
  try {
    await verifyMfaCode(factorId, code);
    clearMfaEnrollmentUi();
    mfaPromptedUserId = null;
    await refreshCloudData();
  } catch (error) {
    mfaEnrollCode.value = '';
    mfaStatus.textContent = `Could not verify this code: ${error.message || 'Enter the latest six-digit code and try again.'}`;
  } finally {
    submitButton.disabled = false;
  }
}

async function verifyMfaChallenge(event) {
  event.preventDefault();
  if (!selectedMfaFactorId || !supabaseClient) return;
  const code = mfaChallengeCode.value.trim();
  const submitButton = mfaChallengeForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  mfaStatus.textContent = 'Verifying authenticator code…';
  try {
    await verifyMfaCode(selectedMfaFactorId, code);
    mfaChallengeCode.value = '';
    mfaPromptedUserId = null;
    await refreshCloudData();
  } catch (error) {
    mfaChallengeCode.value = '';
    mfaStatus.textContent = `Could not verify this code: ${error.message || 'Enter the latest six-digit code and try again.'}`;
  } finally {
    submitButton.disabled = false;
  }
}

async function removeMfaFactor() {
  if (!selectedMfaFactorId || !supabaseClient || assuranceLevel !== 'aal2') return;
  if (!window.confirm('Remove this authenticator? Protected cloud saves and billing will be locked until you set up and verify another factor.'))
    return;

  removeMfaButton.disabled = true;
  try {
    const { error } = await supabaseClient.auth.mfa.unenroll({ factorId: selectedMfaFactorId });
    if (error) throw error;
    selectedMfaFactorId = null;
    mfaPromptedUserId = null;
    await refreshCloudData();
  } catch (error) {
    mfaStatus.textContent = `Could not remove this authenticator: ${error.message || 'Try again.'}`;
  } finally {
    removeMfaButton.disabled = false;
  }
}

async function signOutAccount() {
  if (!supabaseClient) return;
  if (pendingEnrollmentFactorId) await cancelMfaEnrollment();
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    setCloudMessage(`Could not sign out: ${error.message}`);
    return;
  }
  setCloudMessage('You are signed out. Your current editor state remains saved locally.');
}

async function signInWithProvider(provider) {
  if (!supabaseClient) return;
  const providerButton = provider === 'google' ? googleAuthButton : appleAuthButton;
  providerButton.disabled = true;
  authMessage.textContent = '';

  try {
    const desktop = window.keySwapDesktop;
    const redirectTo = desktop
      ? await desktop.getAuthRedirectUrl()
      : `${window.location.origin}${window.location.pathname}`;
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        ...(desktop ? { skipBrowserRedirect: true } : {})
      }
    });
    if (error) throw error;

    if (desktop) {
      if (!data.url) throw new Error('Supabase did not return an authorization URL.');
      await desktop.openExternalAuthUrl(data.url, supabaseConfig.supabaseUrl);
      authMessage.textContent = 'Finish sign-in in your browser. Keep KeySwap open while it returns here.';
    }
  } catch (error) {
    authMessage.textContent = `Could not continue with ${provider === 'google' ? 'Google' : 'Apple'}: ${error.message || 'Check Supabase provider setup.'}`;
  } finally {
    updateCloudUi();
  }
}

async function saveCurrentLayout(event) {
  event.preventDefault();
  if (!supabaseClient || !session) return;
  if (assuranceLevel !== 'aal2') {
    setCloudMessage('Verify or set up an authenticator app before saving to your account.');
    if (!authDialog.open) authDialog.showModal();
    return;
  }
  const name = saveLayoutName.value.trim();
  if (!name) {
    saveLayoutName.focus();
    return;
  }
  saveLayoutButton.disabled = true;
  try {
    const { error } = await supabaseClient.from('saved_layouts').insert({
      user_id: session.user.id,
      name,
      language,
      layout
    });
    if (error) {
      if (error.message.includes('FREE_LAYOUT_LIMIT')) {
        setCloudMessage('Free plan limit reached. Upgrade to Pro to save more layouts.');
      } else {
        throw error;
      }
    } else {
      setCloudMessage(`Saved “${name}” to your account.`);
      saveLayoutForm.reset();
    }
    await refreshCloudData();
  } catch (error) {
    setCloudMessage(`Could not save this layout: ${error.message || 'Check your connection.'}`);
  } finally {
    updateCloudUi();
  }
}

async function loadSavedLayout(saved) {
  if (assuranceLevel !== 'aal2') {
    setCloudMessage('Verify your authenticator code before opening saved layouts.');
    if (!authDialog.open) authDialog.showModal();
    return;
  }
  if (!languages[saved.language] || !isValidLayout(saved.layout)) {
    setCloudMessage('This saved layout has an unsupported format.');
    return;
  }
  language = saved.language;
  layouts[language] = saved.layout;
  layout = layouts[language];
  languageSelect.value = language;
  layoutTitle.textContent = languages[language].name;
  selectedId = null;
  applyLanguageDirection();
  persistLayout();
  updateEditor();
  renderKeyboard();
  showToast(`Loaded “${saved.name}”.`);
}

async function deleteSavedLayout(id) {
  if (!supabaseClient || !session) return;
  if (assuranceLevel !== 'aal2') {
    setCloudMessage('Verify your authenticator code before changing saved layouts.');
    if (!authDialog.open) authDialog.showModal();
    return;
  }
  const { error } = await supabaseClient.from('saved_layouts').delete().eq('id', id);
  if (error) {
    setCloudMessage(`Could not delete the saved layout: ${error.message}`);
    return;
  }
  setCloudMessage('Saved layout deleted.');
  await refreshCloudData();
}

function validateStripeRedirect(url, host) {
  const target = new URL(url);
  if (target.protocol !== 'https:' || target.hostname !== host) {
    throw new Error('Stripe returned an unexpected billing URL.');
  }
  window.location.assign(target.href);
}

async function openBillingFlow(functionName, allowedHost) {
  if (!supabaseClient || !session) return;
  if (assuranceLevel !== 'aal2') {
    setCloudMessage('Verify your authenticator code before opening billing.');
    if (!authDialog.open) authDialog.showModal();
    return;
  }
  upgradeButton.disabled = true;
  managePlanButton.disabled = true;
  try {
    const { data, error } = await supabaseClient.functions.invoke(functionName, { body: {} });
    if (error) throw error;
    if (!data?.url) throw new Error('Billing service did not return a URL.');
    validateStripeRedirect(data.url, allowedHost);
  } catch (error) {
    setCloudMessage(`Billing is not ready: ${error.message || 'Check Stripe and Supabase function setup.'}`);
  } finally {
    updateCloudUi();
  }
}

async function initializeCloudAccount() {
  const projectUrlValue = typeof supabaseConfig.supabaseUrl === 'string' ? supabaseConfig.supabaseUrl.trim() : '';
  const publishableKey = typeof supabaseConfig.supabaseAnonKey === 'string' ? supabaseConfig.supabaseAnonKey.trim() : '';
  const configLocation = window.keySwapDesktop ? 'wwwroot/config.js in the extracted Windows app folder' : 'config.js';
  if (!projectUrlValue || !publishableKey) {
    cloudConfigError = `Supabase is not configured, so sign-up and sign-in are unavailable. Set supabaseUrl and supabaseAnonKey in ${configLocation}; use only the publishable/anon key.`;
    updateCloudUi();
    setCloudMessage(`${cloudConfigError} Local editing remains available; account saving and billing are not connected.`);
    return;
  }

  if (!window.keySwapDesktop && !['http:', 'https:'].includes(window.location.protocol)) {
    cloudConfigError = 'The browser version must be served from an HTTP(S) address before Supabase authentication can work.';
    updateCloudUi();
    setCloudMessage(`${cloudConfigError} Local editing remains available.`);
    return;
  }

  try {
    if (!window.supabase?.createClient) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Supabase client library did not load. Check your internet connection.'));
        document.head.append(script);
      });
    }

    if (!window.supabase?.createClient)
      throw new Error('Supabase client library did not initialize.');

    const projectUrl = new URL(projectUrlValue);
    if (projectUrl.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(projectUrl.hostname))
      throw new Error('Supabase URL must use HTTPS.');
    if (projectUrl.pathname !== '/' || projectUrl.search || projectUrl.hash)
      throw new Error('Supabase URL must be the project root URL, without a path or query string.');
    supabaseClient = window.supabase.createClient(projectUrl.origin, publishableKey, {
      auth: { flowType: 'pkce' }
    });
  } catch (error) {
    cloudConfigError = `Could not initialize Supabase: ${error.message || 'Check the project URL and publishable key in ' + configLocation + '.'}`;
    updateCloudUi();
    setCloudMessage(`${cloudConfigError} Local editing remains available; account saving and billing are not connected.`);
    return;
  }

  supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
    const previousUserId = session?.user?.id;
    session = nextSession;
    if (previousUserId !== session?.user?.id) {
      assuranceLevel = 'aal1';
      subscription = null;
      savedLayouts = [];
      verifiedMfaFactors = [];
      selectedMfaFactorId = null;
      mfaPromptedUserId = null;
      pendingEnrollmentFactorId = null;
      mfaQrCode.removeAttribute('src');
      mfaSecret.textContent = '';
      mfaEnrollCode.value = '';
      mfaChallengeCode.value = '';
    }
    updateCloudUi();
    setTimeout(() => { void refreshCloudData(); }, 0);
  });
  void refreshCloudData();
}

window.addEventListener('keyswauthcallback', async event => {
  const callback = event.detail || {};
  try {
    if (!supabaseClient) throw new Error('Supabase is not configured in config.js.');
    if (callback.error) throw new Error(callback.error);
    if (typeof callback.code !== 'string' || !callback.code)
      throw new Error('The confirmation link did not include an authorization code.');

    const { error } = await supabaseClient.auth.exchangeCodeForSession(callback.code);
    if (error) throw error;
    authForm.reset();
    await refreshCloudData();
  } catch (error) {
    const message = `Could not finish email confirmation: ${error.message || 'Request a new confirmation email.'}`;
    authMessage.textContent = message;
    if (session) mfaStatus.textContent = message;
    setCloudMessage(message);
  }
});

function applyLanguageDirection() {
  const isRtl = languages[language].direction === 'rtl';
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  keyboard.classList.toggle('rtl-legends', isRtl);
}

function updateSystemRemapStatus(result) {
  systemRemapStatus.textContent = result.message;
  applySystemLayoutButton.disabled = false;
  stopSystemRemapButton.disabled = !result.active;
}

function configureSystemRemapping() {
  const desktop = window.keySwapDesktop;
  if (!desktop) return;

  systemRemapStatus.textContent = 'System-wide remapping is off.';
  applySystemLayoutButton.disabled = false;
  applySystemLayoutButton.addEventListener('click', async () => {
    applySystemLayoutButton.disabled = true;
    systemRemapStatus.textContent = 'Applying this keyboard layout…';
    try {
      updateSystemRemapStatus(await desktop.applyLayout({
        language,
        keys: layout.flat().map(({ id, main, alt }) => ({ id, main, alt }))
      }));
    } catch (error) {
      systemRemapStatus.textContent = `Could not apply the layout: ${error.message || 'Check the desktop app.'}`;
      applySystemLayoutButton.disabled = false;
    }
  });
  stopSystemRemapButton.addEventListener('click', async () => {
    stopSystemRemapButton.disabled = true;
    try {
      updateSystemRemapStatus(await desktop.stopRemapping());
    } catch (error) {
      systemRemapStatus.textContent = `Could not stop remapping: ${error.message || 'Check the desktop app.'}`;
      stopSystemRemapButton.disabled = false;
    }
  });
  void desktop.getRemapStatus()
    .then(updateSystemRemapStatus)
    .catch(error => {
      systemRemapStatus.textContent = `Could not read remapping status: ${error.message || 'Check the desktop app.'}`;
    });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!selectedId) return;
  const main = mainInput.value.trim();
  if (!main) {
    mainInput.focus();
    showToast('Enter a main legend before applying.');
    return;
  }
  const key = getKey(selectedId);
  key.main = main;
  key.alt = altInput.value.trim();
  persistLayout();
  updateEditor();
  renderKeyboard();
  showToast('Key assignment updated.');
});

document.querySelector('#reset-layout').addEventListener('click', () => {
  layouts[language] = createLanguageLayout(language);
  layout = layouts[language];
  selectedId = null;
  persistLayout();
  updateEditor();
  renderKeyboard();
  showToast(`${languages[language].name} layout reset.`);
});

document.addEventListener('keydown', event => setPhysicalKeyPressed(event, true));
document.addEventListener('keyup', event => setPhysicalKeyPressed(event, false));
window.addEventListener('blur', () => {
  keyboard.querySelectorAll('.key.pressed').forEach(key => key.classList.remove('pressed'));
});

languageSelect.value = language;
themeSelect.value = theme;
layoutTitle.textContent = languages[language].name;
document.documentElement.dataset.theme = theme;
applyLanguageDirection();

languageSelect.addEventListener('change', () => {
  language = languageSelect.value;
  layout = layouts[language];
  layoutTitle.textContent = languages[language].name;
  selectedId = null;
  applyLanguageDirection();
  persistLayout();
  updateEditor();
  renderKeyboard();
  showToast(`Switched to ${languages[language].name}.`);
});

themeSelect.addEventListener('change', () => {
  theme = themeSelect.value;
  document.documentElement.dataset.theme = theme;
  persistLayout();
  showToast(`${themeSelect.options[themeSelect.selectedIndex].text} theme applied.`);
});

accountButton.addEventListener('click', () => {
  if (!session) setAuthMode('sign-in');
  if (!authDialog.open) authDialog.showModal();
});

document.querySelector('#close-auth-dialog').addEventListener('click', () => authDialog.close());
authDialog.addEventListener('close', () => {
  if (pendingEnrollmentFactorId) void cancelMfaEnrollment();
});
authDialog.addEventListener('click', event => {
  if (event.target === authDialog) authDialog.close();
});
signInTab.addEventListener('click', () => setAuthMode('sign-in'));
signUpTab.addEventListener('click', () => setAuthMode('sign-up'));
googleAuthButton.addEventListener('click', () => { void signInWithProvider('google'); });
appleAuthButton.addEventListener('click', () => { void signInWithProvider('apple'); });
signOutButton.addEventListener('click', () => { void signOutAccount(); });
enrollMfaButton.addEventListener('click', () => { void beginMfaEnrollment(); });
cancelMfaEnrollmentButton.addEventListener('click', () => { void cancelMfaEnrollment(); });
mfaEnrollForm.addEventListener('submit', verifyMfaEnrollment);
mfaChallengeForm.addEventListener('submit', verifyMfaChallenge);
mfaFactorSelect.addEventListener('change', () => {
  selectedMfaFactorId = mfaFactorSelect.value;
  mfaChallengeCode.value = '';
});
removeMfaButton.addEventListener('click', () => { void removeMfaFactor(); });

authForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!supabaseClient) return;
  authSubmit.disabled = true;
  authMessage.textContent = '';
  try {
    const email = authEmail.value.trim();
    const password = authPassword.value;
    if (authMode === 'sign-up') {
      const desktop = window.keySwapDesktop;
      const emailRedirectTo = desktop
        ? await desktop.getAuthRedirectUrl()
        : `${window.location.origin}${window.location.pathname}`;
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { emailRedirectTo }
      });
      if (error) throw error;
      if (data.session) {
        authForm.reset();
        await refreshCloudData();
      } else {
        authMessage.textContent = desktop
          ? 'Check your email and open the confirmation link on this device while KeySwap is still running.'
          : 'Check your email for a confirmation link to finish creating your account.';
      }
    } else {
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      authForm.reset();
      await refreshCloudData();
    }
  } catch (error) {
    authMessage.textContent = `Could not ${authMode === 'sign-up' ? 'create your account' : 'sign in'}: ${error.message || 'Check your email and password.'}`;
  } finally {
    updateCloudUi();
  }
});

saveLayoutForm.addEventListener('submit', saveCurrentLayout);
upgradeButton.addEventListener('click', () => openBillingFlow('create-checkout-session', 'checkout.stripe.com'));
managePlanButton.addEventListener('click', () => openBillingFlow('create-portal-session', 'billing.stripe.com'));

setAuthMode('sign-in');
updateEditor();
renderKeyboard();
initializeCloudAccount();
configureSystemRemapping();
