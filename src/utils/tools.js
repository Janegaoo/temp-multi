/*
 * @Author: Jane
 * @Date: 2020-05-29 09:32:35
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-29 10:24:34
 * @Descripttion:
 */

function escapeHtml(string) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '‘': '&#39;',
    '/': '&#x2F;',
  };
  return String(string).replace(/[&<>"‘\/]/g, (s) => entityMap[s]);
}

export default {
  escapeHtml,
};
