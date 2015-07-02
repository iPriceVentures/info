#!/usr/local/bin/python3
import codecs
import csv
import sys

def main(argv):
    cc = argv[1].upper()
    if cc in ['HK', 'PH', 'SG', 'MY']:
        lang = 'EN'
    else:
        lang = cc

    maps = get_maps(cc, lang)
    write_maps(maps)

def get_maps(cc, lang):

    maps = dict()

    csvfile = codecs.open('map-data.csv', 'rb', 'utf-16')
    r = csv.DictReader(csvfile, delimiter='\t', quotechar='"')
    for row in r:
        # create map for decade if it does not exist yet
        decade = row['Decade']
        if decade not in maps:
            maps[decade] = []

        href = row[cc]
        alt = row['Clothing']
        title = row[lang + ' Desc']
        map1 = row['Map 1']
        map2 = row['Map 2']
        map3 = row['Map 3']
        map4 = row['Map 4']

        if map1:
            maps[decade].append([href, alt, title, map1])
        if map2:
            maps[decade].append([href, alt, title, map2])
        if map3:
            maps[decade].append([href, alt, title, map3])
        if map4:
            maps[decade].append([href, alt, title, map4])

    return maps

def write_maps(maps):
    for m, a in maps.items():
        print ('<map name="' + m + '-map">')
        for k in a:
            print ('  <area shape="poly" alt="' + k[1] + '" coords="' + k[3] + '" title="' + k[2] + '" href="' + k[0] + '" target="_blank">')
        print ("</map>")
    

if __name__ == '__main__':
    main(sys.argv)

