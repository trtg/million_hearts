from flask import Flask,render_template,request,redirect,url_for,abort,session,jsonify
import requests
import json

app = Flask(__name__,static_path='/static/')
#never enable this when externally visible
#app.config['DEBUG']=True

@app.route('/')
def data_input():
    app.logger.error(request.query_string)
    userid = request.args.get('fbuser')
    if userid is None:
        userid=0

    return render_template('data_input.html',fbuser=userid)

@app.route('/find_test_centers')
def find_test_centers():
    #app.logger.error(request.args.get('radius'))
    #app.logger.error(request.query_string)
    location_query = 'https://millionhearts.surescripts.net/test/Provider/Find?%s' % request.query_string
    #params=request.args ?
    result=requests.get(location_query)
    app.logger.error(result.json)
    return jsonify(result.json)

@app.route('/do_archimedes',methods=['POST'])
def do_archimedes():
    app.logger.error(json.dumps(request.form))

    result = requests.post('https://demo-indigo4health.archimedesmodel.com/IndiGO4Health/IndiGO4Health',data=request.form)
    app.logger.error('weee');
    app.logger.error(result.json)
    return jsonify(result.json)
    

if __name__ == '__main__':
    app.run()
