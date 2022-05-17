import pandas as pd


df = pd.read_excel(
    "/home/kenu/Documents/KBTU 2022/Data Visualization/for_final/final_data/real_gross_100_per_hect_wheat.xlsx", index_col=0)

# for column in df.columns:
#     df[column] = df[column].apply(lambda x: 0 if x == "-" else round(x, 2))
#     df[column] = df[column].apply(lambda x: round(x, 2))

    # >>> df.drop(index=('falcon', 'weight'))
df_t = df.T
df_t["Акмолинская"] = df_t["г.Астана"] + df_t["Акмолинская"]
df_t["Алматинская"] = df_t["г.Алматы"] + df_t["Алматинская"]
df_t["Туркестанская"] = df_t["г.Шымкент"] + \
    df_t["Туркестанская"] + df_t["Южно-Казахстанская"]


df = df_t.T
df = df.drop(labels=["г.Алматы", "г.Астана",
             "г.Шымкент", "Южно-Казахстанская"], axis=0)


df_t = df.T
column_re = {'Республика Казахстан': 'Republic of Kazakhstan', 'Акмолинская': 'Aqmola',
             "Актюбинская": "Aqtöbe", "Алматинская": "Almaty", "Атырауская": "Atyrau",
             "Западно-Казахстанская": "West Kazakhstan", "Жамбылская": "Zhambyl",
             "Карагандинская": "Qaraghandy", "Костанайская": "Qostanay", "Мангыстауская": "Mangghystau",
             "Кызылординская": "Qyzylorda", "Туркестанская": "Türkistan",
             "Павлодарская": "Pavlodar", "Северо-Казахстанская": "North Kazakhstan",
             "Восточно-Казахстанская": "East Kazakhstan"}
df_t.rename(columns=column_re, inplace=True)

# print("\n".join([ f"d['{value}'] = +d['{value}'];" for key, value in column_re.items()]))
print("\n".join([ f"'{value}'," for key, value in column_re.items()]))
# print(df_t)
df_t.to_csv("real_gross_100_per_hect_wheat.csv")
