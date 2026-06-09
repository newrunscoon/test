/**
 * 컬렉션 검증 유틸리티.
 *
 * 사용 예:
 *   import { filterValid, partitionValid } from '../Docs/validator.js';
 *   const validEmails = filterValid(extractEmails(users), isValidEmail);
 *   const { valid, invalid } = partitionValid(extractEmails(users), isValidEmail);
 */

/**
 * 검증 함수를 통과한 항목만 반환한다.
 * @param {unknown[]} items - 검증 대상 배열
 * @param {(item: unknown) => boolean} validator - 항목별 검증 함수
 * @returns {unknown[]} 검증을 통과한 항목 배열
 */
function filterValid(items, validator) {
    if (!Array.isArray(items)) {
        return [];
    }
    return items.filter(validator);
}

/**
 * 배열을 검증 통과·실패 두 그룹으로 분리한다.
 * @param {unknown[]} items - 검증 대상 배열
 * @param {(item: unknown) => boolean} validator - 항목별 검증 함수
 * @returns {{ valid: unknown[], invalid: unknown[] }} 통과·실패 항목
 */
function partitionValid(items, validator) {
    if (!Array.isArray(items)) {
        return { valid: [], invalid: [] };
    }

    const valid = [];
    const invalid = [];

    for (const item of items) {
        if (validator(item)) {
            valid.push(item);
        } else {
            invalid.push(item);
        }
    }

    return { valid, invalid };
}

export { filterValid, partitionValid };
