import { SendEmailParams } from 'models/email';

const url = 'https://smtpjs.com/v3/smtpjs.aspx?';
const method = 'POST';

export const Email = {
  send: (params: SendEmailParams) => {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify({
        ...params,
        nocache: Math.floor(1e6 * Math.random() + 1),
        Action: 'Send',
      });

      Email.ajaxPost({
        url,
        body,
        resolve,
        reject,
      });
    });
  },
  ajaxPost: ({
    url,
    body,
    resolve,
    reject,
  }: {
    url: string;
    body: string;
    resolve: (responseText: string) => void;
    reject: (responseText: string) => void;
  }) => {
    const request = Email.createCORSRequest(method, url);

    request.setRequestHeader(
      'Content-type',
      'application/x-www-form-urlencoded',
    );

    request.onreadystatechange = () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        const { status } = request;

        if (status >= 200 && status < 400) {
          resolve(request.responseText);
        } else {
          reject(request.responseText);
        }
      }
    };

    request.send(body);
  },
  createCORSRequest: (method: string, url: string) => {
    const request = new XMLHttpRequest();

    request.open(method, url, true);

    return request;
  },
};
