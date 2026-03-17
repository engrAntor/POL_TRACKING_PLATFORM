import sqlite3
conn = sqlite3.connect('backend/db.sqlite3')
c = conn.cursor()
for name in ['0007_politem','0008_listing','0010_alter_listing_table_alter_politem_table','0011_alter_listing_options_alter_politem_options']:
    c.execute("DELETE FROM django_migrations WHERE app='pol_ai' AND name=?", (name,))
conn.commit()
print("Cleaned stale migration records")
conn.close()
