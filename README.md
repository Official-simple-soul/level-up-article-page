# LevelUp 2024

Welcome to the LevelUp 2024, cohort #4!

If you are seeing this for the first time, please visit [this link](https://supreme-gold-b6b.notion.site/Setting-up-Docker-e095fa4f176d4435919ef1c82f80e03e) containing detailed instructions how to set up this project.

Here is some useful info to get you started.

---

## Easy way to run the whole project

```bash
make run
```

## Verify that backend is running

After running the project, issue the following command:

```bash
curl -H 'Accept: application/json' localhost:8000/api/version
```

## Verify that frontend is running

After running the project, visit [http://localhost](http://localhost) in a browser of your choice.

## Dependency changes in frontend

When new packages are installed, you'll need to run first 

```bash
make rebuild-frontend
```
and then

```bash
make run
```