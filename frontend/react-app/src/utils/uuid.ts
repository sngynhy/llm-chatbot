import { v4 as uuidv4 } from "uuid";

/**
 * UUID v4를 사용한 고유 ID 생성
 * @returns {string} 고유한 UUID 문자열
 */
export function generateUUID(): string {
  return uuidv4();
}

/**
 * 짧은 고유 ID 생성 (UUID의 첫 8자리)
 * @returns {string} 8자리 고유 ID
 */
export function generateShortId(): string {
  return uuidv4().substring(0, 8);
}

/**
 * 타임스탬프 기반 고유 ID 생성
 * @returns {string} 타임스탬프 + 랜덤 문자열
 */
export function generateTimestampId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
}

/**
 * 채팅 ID용 고유 ID 생성 (타임스탬프 기반)
 * @returns {string} 채팅용 고유 ID
 */
export function generateChatId(): string {
  return generateTimestampId();
}

/**
 * 파일명용 고유 ID 생성
 * @param {string} extension - 파일 확장자 (예: 'jpg', 'png')
 * @returns {string} 파일명용 고유 ID
 */
export function generateFileName(extension: string = ""): string {
  const uuid = generateShortId();
  return extension ? `${uuid}.${extension}` : uuid;
}

/**
 * 세션 ID 생성 (브라우저 세션용)
 * @returns {string} 세션용 고유 ID
 */
export function generateSessionId(): string {
  return `session-${generateShortId()}`;
}

/**
 * 임시 ID 생성 (임시 데이터용)
 * @param {string} prefix - 접두사
 * @returns {string} 임시용 고유 ID
 */
export function generateTempId(prefix = "temp"): string {
  return `${prefix}-${generateShortId()}`;
}

/**
 * UUID 유효성 검사
 * @param {string} uuid - 검사할 UUID 문자열
 * @returns {boolean} 유효한 UUID인지 여부
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * ID 형식 정규화 (공백 제거, 소문자 변환)
 * @param {string} id - 정규화할 ID
 * @returns {string} 정규화된 ID
 */
export function normalizeId(id: string): string {
  return id.trim().toLowerCase();
}
