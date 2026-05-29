<!DOCTYPE html>
<html lang="ja">
<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="
      width=device-width,
      initial-scale=1.0,
      maximum-scale=1.0,
      user-scalable=no,
      viewport-fit=cover
    "
  />

  <title>路上ノート</title>

  <link
    rel="manifest"
    href="manifest.json"
  />

  <meta
    name="theme-color"
    content="#000000"
  />

  <meta
    name="apple-mobile-web-app-capable"
    content="yes"
  />

  <meta
    name="apple-mobile-web-app-status-bar-style"
    content="black-translucent"
  />

  <style>

    html,
    body {

      margin: 0;

      width: 100%;
      height: 100%;

      background: #000;
      color: #fff;

      overflow: hidden;

      font-family:
        "Noto Sans JP",
        sans-serif;

      -webkit-user-select: none;
      user-select: none;

      touch-action: manipulation;
    }

    body {

      position: fixed;

      inset: 0;

      display: flex;
      flex-direction: column;
    }

    #captureArea {

      width: 100%;

      min-height: 100%;

      display: flex;
      flex-direction: column;

      box-sizing: border-box;

      overflow: visible;

      padding-bottom: 4px;
    }

    #topArea {

      position: relative;

      width: 100%;

      height: 36px;

      margin-top: 40px;
    }

    #dateText {

      position: absolute;

      left: 16px;
      top: 50%;

      transform: translateY(-50%);

      font-size: 0.95rem;

      display: none;
    }

    #topText {

      position: absolute;

      left: 50%;
      top: 50%;

      transform:
        translate(-50%, -50%);

      font-size: 1.45rem;

      white-space: nowrap;

      cursor: pointer;
    }

    #weatherInput {

      position: absolute;

      right: 16px;
      top: 50%;

      transform: translateY(-50%);

      width: 70px;

      background: transparent;

      color: white;

      border: none;

      border-bottom:
        1px solid #666;

      text-align: right;

      outline: none;

      font-size: 0.95rem;

      display: none;
    }

    #history {

      flex: 1;

      overflow-y: auto;

      padding-left: 20px;
      padding-right: 20px;

      box-sizing: border-box;
    }

    .historyRow {

      width: 100%;

      display: flex;

      justify-content: space-between;

      align-items: center;

      margin-top: 2px;
    }

    .historyItem {

      font-size: 1.27rem;

      line-height: 1.05;

      white-space: nowrap;
    }

    #bottomArea {

      width: 100%;

      flex-shrink: 0;

      margin-top: -2px;

      padding-bottom:
        env(safe-area-inset-bottom);
    }

    #memoArea {

      width: calc(100% - 40px);

      min-height: 90px;

      margin:
        0
        20px
        4px
        20px;

      background: #111;

      color: white;

      border:
        1px solid #333;

      border-radius: 8px;

      resize: none;

      outline: none;

      padding: 8px;

      box-sizing: border-box;

      font-size: 0.95rem;

      line-height: 1.4;

      overflow: hidden;

      white-space: pre-wrap;

      word-break: break-word;
    }

    #saveImageButton {

      width: calc(100% - 40px);

      margin:
        0
        20px
        2px
        20px;

      padding: 8px;

      background: #222;

      color: white;

      border:
        1px solid #444;

      border-radius: 8px;

      font-size: 1rem;
    }

    #inputArea {

      position: fixed;

      left: 50%;
      top: 50%;

      transform:
        translate(-50%, -50%);

      width: 80%;
      max-width: 400px;

      display: flex;
      flex-direction: column;

      gap: 8px;

      background: #111;

      border:
        1px solid #444;

      padding: 18px;

      box-sizing: border-box;

      z-index: 9999;
    }

    input,
    button {

      font-size: 1rem;

      padding: 8px;

      box-sizing: border-box;
    }

    input {

      border: none;

      outline: none;
    }

    button {

      background: #444;

      color: white;

      border: none;
    }

  </style>

</head>

<body>

  <div id="captureArea">

    <div id="topArea">

      <div id="dateText"></div>

      <div id="topText"></div>

      <input
        id="weatherInput"
        type="text"
        placeholder="天気"
      />

    </div>

    <div id="history"></div>

    <div id="bottomArea">

      <textarea
        id="memoArea"
        placeholder="メモ"
      ></textarea>

      <button id="saveImageButton">
        写真
      </button>

    </div>

  </div>

  <div id="inputArea">

    <input
      id="textInput"
      type="text"
      placeholder="現場名を入力"
    />

    <button id="submitButton">
      決定
    </button>

  </div>

  <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>

  <script>

    const captureArea =
      document.getElementById(
        "captureArea"
      );

    const topText =
      document.getElementById(
        "topText"
      );

    const weatherInput =
      document.getElementById(
        "weatherInput"
      );

    const memoArea =
      document.getElementById(
        "memoArea"
      );

    const saveImageButton =
      document.getElementById(
        "saveImageButton"
      );

    const dateText =
      document.getElementById(
        "dateText"
      );

    const inputArea =
      document.getElementById(
        "inputArea"
      );

    const textInput =
      document.getElementById(
        "textInput"
      );

    const submitButton =
      document.getElementById(
        "submitButton"
      );

    function autoResizeMemo() {

      memoArea.style.height =
        "auto";

      memoArea.style.height =
        memoArea.scrollHeight + "px";
    }

    memoArea.addEventListener(
      "input",
      autoResizeMemo
    );

    function updateDate() {

      const now =
        new Date();

      const week = [
        "日",
        "月",
        "火",
        "水",
        "木",
        "金",
        "土"
      ];

      const y =
        now.getFullYear();

      const m =
        String(
          now.getMonth() + 1
        ).padStart(2, "0");

      const d =
        String(
          now.getDate()
        ).padStart(2, "0");

      const w =
        week[now.getDay()];

      dateText.textContent =
        `${y}/${m}/${d}(${w})`;
    }

    updateDate();

    function closeEditor() {

      const text =
        textInput.value.trim();

      if (
        text === ""
      ) {
        return;
      }

      topText.textContent =
        text;

      weatherInput.style.display =
        "block";

      dateText.style.display =
        "block";

      inputArea.style.display =
        "none";
    }

    submitButton.addEventListener(
      "click",
      closeEditor
    );

    saveImageButton.addEventListener(

      "click",

      async () => {

        const memoClone =
          document.createElement(
            "div"
          );

        memoClone.style.width =
          memoArea.offsetWidth + "px";

        memoClone.style.minHeight =
          memoArea.offsetHeight + "px";

        memoClone.style.margin =
          getComputedStyle(memoArea).margin;

        memoClone.style.padding =
          getComputedStyle(memoArea).padding;

        memoClone.style.background =
          "#111";

        memoClone.style.color =
          "white";

        memoClone.style.border =
          "1px solid #333";

        memoClone.style.borderRadius =
          "8px";

        memoClone.style.boxSizing =
          "border-box";

        memoClone.style.fontSize =
          "0.95rem";

        memoClone.style.lineHeight =
          "1.4";

        memoClone.style.whiteSpace =
          "normal";

        memoClone.style.wordBreak =
          "break-word";

        memoClone.innerHTML =

          memoArea.value

            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")

            .replace(/\n/g, "<br>");

        memoArea.style.display =
          "none";

        memoArea.parentNode.insertBefore(
          memoClone,
          memoArea
        );

        saveImageButton.style.visibility =
          "hidden";

        const oldHeight =
          captureArea.style.height;

        captureArea.style.height =
          "auto";

        await new Promise(
          resolve =>
            requestAnimationFrame(
              resolve
            )
        );

        const canvas =
          await html2canvas(
            captureArea,
            {
              backgroundColor:
                "#000",

              useCORS: true,

              width:
                captureArea.scrollWidth,

              height:
                captureArea.scrollHeight,

              windowWidth:
                captureArea.scrollWidth,

              windowHeight:
                captureArea.scrollHeight,

              scrollX: 0,
              scrollY: -40
            }
          );

        captureArea.style.height =
          oldHeight;

        memoClone.remove();

        memoArea.style.display =
          "block";

        saveImageButton.style.visibility =
          "visible";

        canvas.toBlob(

          async blob => {

            const file =
              new File(
                [blob],
                "record.png",
                {
                  type:
                    "image/png"
                }
              );

            if (
              navigator.canShare &&
              navigator.canShare({
                files: [file]
              })
            ) {

              await navigator.share({

                files: [file],

                title:
                  "record"
              });

              return;
            }

            const link =
              document.createElement(
                "a"
              );

            link.href =
              URL.createObjectURL(
                blob
              );

            link.download =
              "record.png";

            link.click();
          }
        );
      }
    );

    if (
      "serviceWorker"
      in navigator
    ) {

      navigator
        .serviceWorker
        .register("./sw.js");
    }

  </script>

</body>
</html>
