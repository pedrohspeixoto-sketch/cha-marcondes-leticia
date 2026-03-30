#!/bin/bash
# Generate 50 SVG placeholder images for wedding gift website

OUTDIR="C:/Users/peixoto.pedro/projetos/casamento marcondes/img/presentes"
mkdir -p "$OUTDIR"

generate_svg() {
  local num="$1"
  local name="$2"
  local category="$3"
  local color="$4"
  local emoji="$5"

  local padded
  padded=$(printf "%02d" "$num")

  cat > "$OUTDIR/${padded}.svg" <<SVGEOF
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect width="400" height="300" rx="8" fill="${color}"/>
  <text x="200" y="130" text-anchor="middle" font-family="sans-serif" font-size="48">${emoji}</text>
  <text x="200" y="190" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="600" fill="#333">${name}</text>
  <text x="200" y="220" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#666">${category}</text>
</svg>
SVGEOF
}

# COZINHA - #F4A261
E_COZ="🍳"
C_COZ="#F4A261"
CAT_COZ="Cozinha"
generate_svg 1  "Jogo de Panelas"        "$CAT_COZ" "$C_COZ" "$E_COZ"
generate_svg 2  "Jogo de Talheres"       "$CAT_COZ" "$C_COZ" "$E_COZ"
generate_svg 3  "Jogo de Pratos"         "$CAT_COZ" "$C_COZ" "$E_COZ"
generate_svg 4  "Jogo de Copos"          "$CAT_COZ" "$C_COZ" "$E_COZ"
generate_svg 5  "Jogo de Xícaras"        "$CAT_COZ" "$C_COZ" "$E_COZ"
generate_svg 6  "Faqueiro Completo"      "$CAT_COZ" "$C_COZ" "$E_COZ"
generate_svg 7  "Conjunto de Potes"      "$CAT_COZ" "$C_COZ" "$E_COZ"
generate_svg 8  "Jogo de Travessas"      "$CAT_COZ" "$C_COZ" "$E_COZ"
generate_svg 9  "Forma de Bolo"          "$CAT_COZ" "$C_COZ" "$E_COZ"
generate_svg 10 "Conjunto de Assadeiras" "$CAT_COZ" "$C_COZ" "$E_COZ"

# ELETRODOMÉSTICOS - #89B4FA
E_ELE="⚡"
C_ELE="#89B4FA"
CAT_ELE="Eletrodomésticos"
generate_svg 11 "Cafeteira"                "$CAT_ELE" "$C_ELE" "$E_ELE"
generate_svg 12 "Liquidificador"           "$CAT_ELE" "$C_ELE" "$E_ELE"
generate_svg 13 "Airfryer"                 "$CAT_ELE" "$C_ELE" "$E_ELE"
generate_svg 14 "Aspirador de Pó"          "$CAT_ELE" "$C_ELE" "$E_ELE"
generate_svg 15 "Ferro de Passar"          "$CAT_ELE" "$C_ELE" "$E_ELE"
generate_svg 16 "Mixer"                    "$CAT_ELE" "$C_ELE" "$E_ELE"
generate_svg 17 "Torradeira"               "$CAT_ELE" "$C_ELE" "$E_ELE"
generate_svg 18 "Sanduicheira"             "$CAT_ELE" "$C_ELE" "$E_ELE"
generate_svg 19 "Batedeira"               "$CAT_ELE" "$C_ELE" "$E_ELE"
generate_svg 20 "Panela Elétrica de Arroz" "$CAT_ELE" "$C_ELE" "$E_ELE"

# QUARTO - #CBA6F7
E_QUA="🛏️"
C_QUA="#CBA6F7"
CAT_QUA="Quarto"
generate_svg 21 "Jogo de Cama Casal"       "$CAT_QUA" "$C_QUA" "$E_QUA"
generate_svg 22 "Kit de Travesseiros"       "$CAT_QUA" "$C_QUA" "$E_QUA"
generate_svg 23 "Edredom Casal"             "$CAT_QUA" "$C_QUA" "$E_QUA"
generate_svg 24 "Luminária de Cabeceira"    "$CAT_QUA" "$C_QUA" "$E_QUA"
generate_svg 25 "Organizador de Closet"     "$CAT_QUA" "$C_QUA" "$E_QUA"
generate_svg 26 "Jogo de Fronhas"           "$CAT_QUA" "$C_QUA" "$E_QUA"
generate_svg 27 "Cobertor Casal"            "$CAT_QUA" "$C_QUA" "$E_QUA"
generate_svg 28 "Cortina para Quarto"       "$CAT_QUA" "$C_QUA" "$E_QUA"

# BANHEIRO - #A6E3A1
E_BAN="🛁"
C_BAN="#A6E3A1"
CAT_BAN="Banheiro"
generate_svg 29 "Jogo de Toalhas de Banho"  "$CAT_BAN" "$C_BAN" "$E_BAN"
generate_svg 30 "Kit de Tapetes de Banheiro" "$CAT_BAN" "$C_BAN" "$E_BAN"
generate_svg 31 "Lixeira de Banheiro"        "$CAT_BAN" "$C_BAN" "$E_BAN"
generate_svg 32 "Organizador de Banheiro"    "$CAT_BAN" "$C_BAN" "$E_BAN"
generate_svg 33 "Jogo de Toalhas de Rosto"   "$CAT_BAN" "$C_BAN" "$E_BAN"

# SALA/DECORAÇÃO - #F9E2AF
E_SAL="🏠"
C_SAL="#F9E2AF"
CAT_SAL="Sala / Decoração"
generate_svg 34 "Jogo de Almofadas"   "$CAT_SAL" "$C_SAL" "$E_SAL"
generate_svg 35 "Tapete de Sala"      "$CAT_SAL" "$C_SAL" "$E_SAL"
generate_svg 36 "Porta-Retratos"      "$CAT_SAL" "$C_SAL" "$E_SAL"
generate_svg 37 "Vaso Decorativo"     "$CAT_SAL" "$C_SAL" "$E_SAL"
generate_svg 38 "Relógio de Parede"   "$CAT_SAL" "$C_SAL" "$E_SAL"
generate_svg 39 "Jogo Americano"      "$CAT_SAL" "$C_SAL" "$E_SAL"
generate_svg 40 "Cortina para Sala"   "$CAT_SAL" "$C_SAL" "$E_SAL"

# UTILIDADES - #F5C2E7
E_UTI="🎁"
C_UTI="#F5C2E7"
CAT_UTI="Utilidades"
generate_svg 41 "Tábua de Passar"        "$CAT_UTI" "$C_UTI" "$E_UTI"
generate_svg 42 "Varal de Chão"          "$CAT_UTI" "$C_UTI" "$E_UTI"
generate_svg 43 "Lixeira de Cozinha"     "$CAT_UTI" "$C_UTI" "$E_UTI"
generate_svg 44 "Kit de Panos de Prato"  "$CAT_UTI" "$C_UTI" "$E_UTI"
generate_svg 45 "Conjunto de Cestinhos"  "$CAT_UTI" "$C_UTI" "$E_UTI"
generate_svg 46 "Kit de Organização"     "$CAT_UTI" "$C_UTI" "$E_UTI"
generate_svg 47 "Jogo de Facas"          "$CAT_UTI" "$C_UTI" "$E_UTI"
generate_svg 48 "Garrafa Térmica"        "$CAT_UTI" "$C_UTI" "$E_UTI"
generate_svg 49 "Kit Churrasco"          "$CAT_UTI" "$C_UTI" "$E_UTI"
generate_svg 50 "Vale Presente Especial" "$CAT_UTI" "$C_UTI" "$E_UTI"

echo "Generated 50 SVG files in $OUTDIR"
ls -1 "$OUTDIR"/*.svg | wc -l
