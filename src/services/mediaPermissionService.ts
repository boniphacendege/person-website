/**
 * Media Permission and Device Handling Service
 * Wraps navigator.mediaDevices.getUserMedia and provides clear, user-friendly
 * error diagnosis and Google Chrome site-settings instructions.
 */

export type MediaErrorType =
  | 'NotAllowedError'
  | 'NotFoundError'
  | 'NotReadableError'
  | 'OverconstrainedError'
  | 'UnsupportedError'
  | 'UnknownError';

export interface MediaPermissionResult {
  success: boolean;
  stream: MediaStream | null;
  errorType: MediaErrorType | null;
  errorMessage: string | null;
  userFriendlyInstruction: string | null;
  swahiliInstruction: string | null;
  hasAudioTrack: boolean;
  hasVideoTrack: boolean;
}

export interface RequestMediaOptions {
  facingMode?: 'user' | 'environment';
  deviceId?: string;
  withAudio?: boolean;
  audioDeviceId?: string;
}

/**
 * Check if the browser supports mediaDevices API
 */
export const isMediaDevicesSupported = (): boolean => {
  return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
};

/**
 * Check if running inside an iframe
 */
export const isIframeEnvironment = (): boolean => {
  try {
    return typeof window !== 'undefined' && window.self !== window.top;
  } catch {
    return true;
  }
};

/**
 * Open standalone top-level window if inside iframe
 */
export const openStandaloneTab = (): void => {
  if (typeof window !== 'undefined') {
    const directUrl = window.location.href;
    window.open(directUrl, '_blank', 'noopener,noreferrer');
  }
};

/**
 * Query browser permission state if supported
 */
export const queryCameraPermission = async (): Promise<PermissionState | 'unsupported'> => {
  try {
    if (typeof navigator !== 'undefined' && 'permissions' in navigator && navigator.permissions?.query) {
      const status = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return status.state;
    }
  } catch {
    // Permission query not supported on this browser/platform
  }
  return 'unsupported';
};

/**
 * Core service to request user media with tiered resilience and detailed Chrome guidance
 */
export const requestUserMediaStream = async (
  options: RequestMediaOptions = {}
): Promise<MediaPermissionResult> => {
  const { facingMode = 'user', deviceId, withAudio = true, audioDeviceId } = options;

  if (!isMediaDevicesSupported()) {
    return {
      success: false,
      stream: null,
      errorType: 'UnsupportedError',
      errorMessage: 'navigator.mediaDevices.getUserMedia is not supported on this browser',
      userFriendlyInstruction:
        'Your browser does not support live camera streaming. Please use Google Chrome on desktop or Android.',
      swahiliInstruction:
        'Kivinjari hiki hakitumii kamera ya video. Tafadhali fungua tovuti hii ukitumia Google Chrome kwenye kompyuta au simu ya Android.',
      hasAudioTrack: false,
      hasVideoTrack: false,
    };
  }

  let stream: MediaStream | null = null;
  let lastError: unknown = null;

  // Build audio constraints
  const audioConstraints: boolean | MediaTrackConstraints = withAudio
    ? audioDeviceId && audioDeviceId !== 'default'
      ? { deviceId: { exact: audioDeviceId } }
      : true
    : false;

  // Tier 1: Exact Device ID or ideal facingMode + Audio
  try {
    const videoConstraint: MediaTrackConstraints = deviceId
      ? { deviceId: { exact: deviceId } }
      : { facingMode: { ideal: facingMode } };

    stream = await navigator.mediaDevices.getUserMedia({
      video: videoConstraint,
      audio: audioConstraints,
    });
  } catch (err1) {
    lastError = err1;

    // Tier 2: Direct facingMode + Audio
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: audioConstraints,
      });
    } catch (err2) {
      lastError = err2;

      // Tier 3: Generic video + audio
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: audioConstraints,
        });
      } catch (err3) {
        lastError = err3;

        // Tier 4: Video only (in case audio failed due to mic hardware missing, mic blocked, or busy)
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
        } catch (err4) {
          lastError = err4;

          // Tier 5: Audio only (in case camera is disconnected or busy, but audio is available)
          if (withAudio) {
            try {
              stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
              });
            } catch (err5) {
              lastError = err5;
            }
          }
        }
      }
    }
  }

  if (stream) {
    return {
      success: true,
      stream,
      errorType: null,
      errorMessage: null,
      userFriendlyInstruction: null,
      swahiliInstruction: null,
      hasAudioTrack: stream.getAudioTracks().length > 0,
      hasVideoTrack: stream.getVideoTracks().length > 0,
    };
  }

  // Diagnose failed attempt
  return diagnoseMediaError(lastError);
};

/**
 * Diagnostic helper to translate browser errors to user-friendly Chrome site setting instructions
 */
function buildPermissionDeniedResult(err: unknown): MediaPermissionResult {
  const errMsg = err instanceof Error ? err.message : String(err);
  const inIframe = isIframeEnvironment();

  const userFriendlyInstruction = inIframe
    ? 'In Chrome, Site Settings shows: "Site can ask for your camera". When running in an embedded preview, Chrome security blocks camera pop-ups. Click "Open in Standalone Chrome Tab" or tap "Activate Camera Now" below.'
    : 'Chrome Site Settings shows: "Site can ask for your camera" and "Site can ask for your microphone". Chrome is ready! Tap "Activate Camera Now" below, then tap "Allow" or "While using the app" in the Chrome pop-up.';

  const swahiliInstruction = inIframe
    ? 'Kwenye Chrome imeandikwa: "Site can ask for your camera". Kivinjari kinazuia kamera kwenye dirisha la ndani. Bonyeza "Fungua Dirisha Kamili la Chrome" au bonyeza "Washa Kamera Sasa" hapa chini.'
    : 'Kwenye Chrome imeandikwa: "Site can ask for your camera" na "Site can ask for your microphone". Chrome ipo tayari! Bonyeza kitufe cha "Washa Kamera Sasa" hapa chini, kisha chagua "Allow" (Ruhusu) au "While using the app" kwenye kidirisha cha Chrome.';

  return {
    success: false,
    stream: null,
    errorType: 'NotAllowedError',
    errorMessage: errMsg,
    userFriendlyInstruction,
    swahiliInstruction,
    hasAudioTrack: false,
    hasVideoTrack: false,
  };
}

function diagnoseMediaError(err: unknown): MediaPermissionResult {
  const name = err instanceof Error ? err.name : '';
  const message = err instanceof Error ? err.message : String(err);

  if (
    name === 'NotAllowedError' ||
    name === 'PermissionDeniedError' ||
    message.toLowerCase().includes('permission') ||
    message.toLowerCase().includes('denied')
  ) {
    return buildPermissionDeniedResult(err);
  }

  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return {
      success: false,
      stream: null,
      errorType: 'NotFoundError',
      errorMessage: message,
      userFriendlyInstruction:
        'No camera or microphone hardware found. Please connect an external USB webcam, Konica/Canon camera, or mobile device.',
      swahiliInstruction:
        'Hakuna kifaa cha kamera au maikrofoni kilichopatikana. Tafadhali unganisha kamera ya nje ya USB au tumia simu ya mkononi.',
      hasAudioTrack: false,
      hasVideoTrack: false,
    };
  }

  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return {
      success: false,
      stream: null,
      errorType: 'NotReadableError',
      errorMessage: message,
      userFriendlyInstruction:
        'Camera is already in use by another application or tab (e.g. Zoom, Google Meet). Please close other apps and try again.',
      swahiliInstruction:
        'Kamera inatumiwa na programu nyingine (kama Zoom, Google Meet au dirisha lingine). Funga programu hiyo kisha ubonyeze Jaribu Tena.',
      hasAudioTrack: false,
      hasVideoTrack: false,
    };
  }

  if (name === 'OverconstrainedError') {
    return {
      success: false,
      stream: null,
      errorType: 'OverconstrainedError',
      errorMessage: message,
      userFriendlyInstruction:
        'The requested camera resolution or facing mode is not supported by your camera hardware. Falling back to default camera.',
      swahiliInstruction:
        'Umbizo la kamera iliyoombwa halilingani na kifaa chako. Tunajaribu kutumia kamera ya kawaida.',
      hasAudioTrack: false,
      hasVideoTrack: false,
    };
  }

  return {
    success: false,
    stream: null,
    errorType: 'UnknownError',
    errorMessage: message,
    userFriendlyInstruction:
      'Could not connect to camera or microphone. Please ensure Chrome has camera access in your device operating system settings and tap Retry.',
    swahiliInstruction:
      'Haikuweza kuunganishwa na kamera au maikrofoni. Tafadhali hakikisha Google Chrome inaruhusiwa kutumia kamera kwenye mipangilio ya simu/kompyuta yako.',
    hasAudioTrack: false,
    hasVideoTrack: false,
  };
}

/**
 * Step-by-step Chrome instructions for users on Desktop & Android
 */
export const getChromeInstructions = (isSwahili: boolean) => {
  if (isSwahili) {
    return {
      title: 'Maelekezo: Chrome ikisema "Site can ask for your camera"',
      directExplanation:
        'Ukiingia kwenye Site settings na ukakuta "Site can ask for your camera", hiyo inamaanisha Chrome ipo tayari kutoa idhini! Chrome inasubiri ubonyeze kitufe hapa chini ili ionyeshe kidirisha cha [Allow / Ruhusu].',
      desktop: [
        'Chrome ikionyesha "Site can ask for your camera", bonyeza kitufe cha "Washa Kamera Sasa" kwenye ukurasa huu.',
        'Kidirisha cha Chrome kikitokea juu kushoto kikiuliza ruhusa, bonyeza "Allow" (Ruhusu).',
        'Kama kikiwa bado kimezuiwa, bonyeza alama ya kufuli (🔒) kwenye upau wa anwani > weka Camera kuwa "Allow".',
      ],
      android: [
        'Kwenye simu, Chrome ikionyesha "Site can ask for your camera", hiyo ni hali sahihi.',
        'Bonyeza kitufe cha "Washa Kamera Sasa" hapa chini.',
        'Kwenye kidirisha cha Chrome kinachotokea chini, chagua "While using the app" (Wakati unatumia programu) au "Allow".',
      ],
      retryButton: 'Washa Kamera Sasa (Allow Prompt)',
    };
  }

  return {
    title: 'Notice: When Chrome says "Site can ask for your camera"',
    directExplanation:
      'When Chrome Site settings displays "Site can ask for your camera" and "Site can ask for your microphone", Chrome is ready! Chrome is waiting for you to tap the button below so it can display the [Allow] prompt.',
    desktop: [
      'Since Chrome says "Site can ask for your camera", tap the "Activate Camera Now" button below.',
      'When Chrome displays the pop-up near the address bar, click "Allow".',
      'If you are using the embedded preview window, click "Open in Standalone Tab" for direct access.',
    ],
    android: [
      'On Android Chrome, "Site can ask for your camera" is the active prompt state.',
      'Tap the "Activate Camera Now" button below.',
      'When the Chrome pop-up appears at the bottom or top, tap "While using the app" or "Allow".',
    ],
    retryButton: 'Activate Camera Now (Allow Prompt)',
  };
};
