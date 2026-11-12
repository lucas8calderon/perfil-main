# Currículo em PDF

O site não inclui um PDF neste repositório. Enquanto o arquivo não existir, os botões de currículo apontam para o LinkedIn e não tentam baixar um arquivo ausente.

Nome esperado, nesta pasta:

`Lucas-Calderon-Curriculo.pdf`

Caminho relativo usado pelo site, quando o arquivo existir:

`./cv/Lucas-Calderon-Curriculo.pdf`

Enquanto o PDF não estiver nesta pasta, os links com a classe `js-cv` no `index.html` apontam para:

https://www.linkedin.com/in/lucascalderon/

Quando o arquivo existir, troque o `href` desses links para `./cv/Lucas-Calderon-Curriculo.pdf`, acrescente `download="Lucas-Calderon-Curriculo.pdf"` e mude o texto visível para "Baixar currículo". Não há checagem automática, para o navegador não pedir um arquivo que ainda não existe.
