import multiparty from 'multiparty';

/**
 * Middleware для парсингу multipart/form-data
 * @param {Object} event - AWS Lambda event
 * @returns {Promise<Object>} - Об'єкт з полями `fields` і `files`
 */
export const parseMultipartFormData = (event) => {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();

    form.parse(event, (err, fields, files) => {
      if (err) {
        console.error('Помилка парсингу файлу:', err);
        return reject({
          statusCode: 400,
          body: JSON.stringify({ error: 'Помилка завантаження файлу' }),
        });
      }
      event.body = { fields, files };
      resolve({ fields, files });
    });
  });
};
