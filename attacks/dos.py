import requests

def attack():
    print('Begin attack')

    i = 0
    try:
        while(True):
            res = requests.get('http://127.0.0.1:3000/user/login/test/test')
            if (res.status_code == 429):
                print('Attack blocked after', i, 'requests')
                break
            i += 1
    except Exception as e: 
        print('Attack successful after', i, 'requests')

attack()
