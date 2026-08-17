# skanowski.pl

Wirtualne spacery 360° na Mapach Google. Statyczna strona pod **GitHub Pages**.

## Lokalnie

W katalogu projektu:

```bash
python3 -m http.server 8080
```

Otwórz [http://localhost:8080](http://localhost:8080).

## Publikacja na GitHub Pages

1. Utwórz repozytorium (np. `skanowskipl_web` albo `username.github.io`).
2. Wypchnij ten katalog na gałąź `main`.
3. GitHub → **Settings → Pages**
   - Source: `Deploy from a branch`
   - Branch: `main` / `/ (root)`
4. Plik `CNAME` ustawia domenę `skanowski.pl`.

## DNS domeny skanowski.pl

U registrar domeny:

**Wariant A — apex `skanowski.pl`**

Rekordy A na IP GitHub Pages:

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

Opcjonalnie AAAA:

- `2606:50c0:8000::153`
- `2606:50c0:8001::153`
- `2606:50c0:8002::153`
- `2606:50c0:8003::153`

**Wariant B — `www.skanowski.pl`**

Rekord CNAME: `www` → `TWOJ-USER.github.io`

Po propagacji DNS włącz custom domain w Pages i poczekaj na certyfikat HTTPS.

## Kontakt

Pola e-mail i telefon są celowo puste — uzupełnimy w `index.html` w sekcji `#kontakt`.
