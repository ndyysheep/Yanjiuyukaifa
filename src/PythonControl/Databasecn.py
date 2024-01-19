from sqlalchemy import create_engine, MetaData, select, update
from sqlalchemy.orm import sessionmaker
def flow_update(table_name, new_values):
    # 数据库连接参数
    db_user = 'tmxq'
    db_password = '123456'
    db_host = '101.35.232.25'
    db_port = '3306'
    db_name = 'yjykfsj8'

    # 构建数据库连接URL
    connection_string = f'mysql+mysqlconnector://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}'

    # 创建连接到MySQL数据库的引擎
    engine = create_engine(connection_string, echo=False)
    metadata = MetaData()
    metadata.reflect(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    if table_name in metadata.tables:
        table = metadata.tables[table_name]

        # 获取第一行的主键ID
        first_row = session.execute(select(table)).first()
        if first_row is None:
            print(f"No data found in table '{table_name}'.")
            return

        first_row_id = first_row[0]  # 假设第一个元素是主键ID

        # 构造更新语句
        update_stmt = (
            update(table).
            where(table.c.id == first_row_id).  # 假设主键列名为'id'
            values({table.columns[2]: new_values[0],
                    table.columns[3]: new_values[1],
                    table.columns[4]: new_values[2]})
        )

        # 执行更新
        session.execute(update_stmt)
        session.commit()
        print(f"First row of table '{table_name}' has been updated.")

    else:
        print(f"The table '{table_name}' does not exist in the database.")

    session.close()


def fetch_table_contents(table_name):
    # 数据库连接参数
    db_user = 'tmxq'
    db_password = '123456'
    db_host = '101.35.232.25'
    db_port = '3306'
    db_name = 'yjykfsj8'

    # 构建数据库连接URL
    connection_string = f'mysql+mysqlconnector://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}'

    # 创建连接到MySQL数据库的引擎
    engine = create_engine(connection_string, echo=False)

    # 反映数据库元数据
    metadata = MetaData()
    metadata.reflect(bind=engine)

    # 创建session
    Session = sessionmaker(bind=engine)
    session = Session()

    # 确认表存在
    if table_name in metadata.tables:
        # 选择指定的表
        table = metadata.tables[table_name]

        # 查询指定表并打印内容
        query = select(table)
        result = session.execute(query)

        # 收集所有行为列表
        rows = [row for row in result]

        # 关闭session
        session.close()

        # 打印结果
        for row in rows:
            print(row)

        return rows
    else:
        print(f"The table '{table_name}' does not exist in the database.")
        session.close()
        return []

def insert_violation_times(violation_times):
    # 数据库连接参数
    db_user = 'tmxq'
    db_password = '123456'
    db_host = '101.35.232.25'
    db_port = '3306'
    db_name = 'yjykfsj8'

    # 构建数据库连接URL
    connection_string = f'mysql+mysqlconnector://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}'

    # 创建连接到MySQL数据库的引擎
    engine = create_engine(connection_string, echo=False)
    metadata = MetaData()
    metadata.reflect(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    table = metadata.tables.get('illegal_info')
    if table is not None:
        for time in violation_times:
            insert_statement = table.insert().values(time_start=time, time_end=time)
            session.execute(insert_statement)
        session.commit()
        print("Violation times have been inserted into the database.")
    else:
        print("Table 'illegal_info' does not exist.")

    session.close()