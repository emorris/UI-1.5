from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/regulation/<query>')
def regulation(query):
    return render_template('regulation.html',
                           query = query)

@app.route('/interaction/<query>')
def interaction(query):
    return render_template('interaction.html',
                           query = query)

if __name__ == '__main__':
    app.run('sgd-dev-2.stanford.edu', 5050, debug=True)
    
