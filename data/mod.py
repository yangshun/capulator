import csv, json, operator

with open('mod_info.json','r') as infile:
    allInfo = json.load(infile)
    print(type(allInfo))
    for var in allInfo:
        allInfo[var].pop('description', None)
        allInfo[var].pop('preclusion', None)
        allInfo[var].pop('preclusion_module', None)
        allInfo[var].pop('prerequisite', None)
        allInfo[var].pop('prerequisite_module', None)
    print(allInfo)
    r = open('mod_op.json', 'w')
    r.write(json.dumps(allInfo))
