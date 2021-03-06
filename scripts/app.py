from threading import Thread
import os
from flask import Flask, request, abort
from hashlib import sha256
import hmac

from fabfile import build_site


app = Flask(__name__)


@app.route('/push', methods=['POST'])
def build_on_push():
    payload = request.get_data()
    if verify_signature(payload):
        Thread(target=build_site, kwargs={'local': True}).start()
        return 'build successful'
    else:
        app.logger.error(f'Cannot verify signature from {request.remote_addr}!')
        abort(400)


def verify_signature(payload):
    signature = hmac.new(
        os.environ['SECRET_KEY'].encode(),
        payload, digestmod=sha256
    ).hexdigest()

    return request.headers['X-Hub-Signature-256'] == 'sha256=' + signature


if __name__ == '__main__':
    # only used for test
    app.run(host='0.0.0.0', port=5555)
