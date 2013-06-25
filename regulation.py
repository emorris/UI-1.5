from flask import Flask, render_template
import simplejson as json
import urllib2

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/<query>')
def regulation(query):
    gene_json = get_gene_info(query)
    
    return render_template('regulation.html',
                           query = query,
                           page = 'Regulation',
                           title = gene_json['title_name'],
                           dbid = gene_json['dbid'],
                           protein = gene_json['protein_name'],
                           display = gene_json['display_name'])

@app.route('/circos/<img>')
def display_image(img):

    tmpArray = img.split("_")
    gene_json = get_gene_info(tmpArray[1]);
    
    return render_template('image.html',
                           file = img,
                           title = gene_json['title'],
                           dbid  = gene_json['dbid'])

def get_gene_info(query):
    url = 'http://cherry-vm26.stanford.edu/yeastmine_backend/gene/display_name/' +query;
    request = urllib2.urlopen(url)
    data = request.read()
   
    return json.loads(data)
    

if __name__ == '__main__':
    app.run()
    
