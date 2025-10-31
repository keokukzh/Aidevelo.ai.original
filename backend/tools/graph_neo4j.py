import os
from typing import Optional
from neo4j import GraphDatabase, Driver


def get_client() -> Optional[Driver]:
    uri = os.getenv("NEO4J_URI")
    user = os.getenv("NEO4J_USER")
    pw = os.getenv("NEO4J_PASSWORD")
    if not uri or not user or not pw:
        return None
    return GraphDatabase.driver(uri, auth=(user, pw))


def ensure_constraints(driver: Driver) -> None:
    with driver.session() as session:
        session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (p:Project) REQUIRE p.id IS UNIQUE")
        session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (t:Task) REQUIRE t.id IS UNIQUE")
        session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (f:File) REQUIRE f.path IS UNIQUE")


def upsert_node(driver: Driver, label: str, key: str, props: dict) -> None:
    cypher = f"MERGE (n:{label} {{{key}: $value}}) SET n += $props"
    with driver.session() as session:
        session.run(cypher, value=props[key], props=props)


