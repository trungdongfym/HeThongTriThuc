const wrapper = document.querySelector('.wrapper');
const listAction = document.querySelector('.emotion_items');
const btn_next = document.querySelector('.btn_next');
const btn_skip = document.querySelector('.btn_skip');
const btn_back = document.querySelector('.btn_back');
const questionText = document.querySelector('.question_text');
const containerQuestion = document.querySelector('.container');

const facialParts = {
  cheek: "Má",
  eyebrow: "Lông mày",
  eyelid: "Mí mắt",
  jaw: "Cằm",
  lip: "Môi",
  mouth: "Miệng",
  nose: "Mũi",
};

const textBtn = '<span>Tiếp tục</span><i class="far fa-arrow-right"></i>';

const run = async () => {
  const requestData = {};
  let currentIndex = 0;
  const data = await getData();
  const aus = data.aus;
  const actions = data.data;

  const actionKeys = Object.keys(actions);
  const actionValue = Object.values(actions);

  btn_next.onclick = () => {
    if (currentIndex + 1 >= actionKeys.length) {
      showResult(requestData, aus);
      return;
    };
    currentIndex++;
    (currentIndex + 1 >= actionKeys.length) ? btn_next.textContent = 'Hoàn thành' : btn_next.innerHTML = textBtn;


    if (btn_next.classList.contains('disabled')) return;
    render({ facialPart: actionKeys[currentIndex], actionAus: actionValue[currentIndex] });
  }

  btn_back.onclick = () => {
    if (currentIndex === 0) return;
    currentIndex--;
    (currentIndex + 1 >= actionKeys.length) ? btn_next.textContent = 'Hoàn thành' : btn_next.innerHTML= textBtn;
    render({ facialPart: actionKeys[currentIndex], actionAus: actionValue[currentIndex] });
  }

  btn_skip.onclick = () => {
    if (currentIndex + 1 >= actionKeys.length) {
      showResult(requestData, aus);
      return;
    };
    requestData[actionKeys[currentIndex]] = 'normal';
    currentIndex++;
    (currentIndex + 1 >= actionKeys.length) ? btn_next.textContent = 'Hoàn thành' : btn_next.innerHTML = textBtn;
    render({ facialPart: actionKeys[currentIndex], actionAus: actionValue[currentIndex] });
  }

  function render({ facialPart, actionAus }) {
    questionText.textContent = `${facialParts[facialPart]} của bạn tương ứng với trường hợp nào sau đây ?`;

    (!requestData[facialPart] || requestData[facialPart] === 'normal') ? btn_next.classList.add('disabled') : btn_next.classList.remove('disabled');

    const emotionItemsHTML = [];
    for (const actionAu of actionAus) {
      const auDescription = aus.find(i => i.au === actionAu);
      if (!auDescription) continue;
      const { au, img: imgUrl, description } = auDescription;
      const elementHtml = (
        `<li class="emotion_item">
        <label>
          <div>
            <img src="${imgUrl}" alt="img-aus"
            class="emotion_item-img">
          </div>
          <div class="emotion_item-text">
            <input type="radio" name="${facialPart}" class="radio" ${requestData[facialPart] === au ? 'checked' : ''} value="${au}" />
            <p style="margin:10px 0">${description}</p>
          </div>
        </label>
      </li>`
      )
      emotionItemsHTML.push(elementHtml);
    }
    
    listAction.innerHTML = emotionItemsHTML.join('');
    const btnRadios = document.querySelectorAll('.radio');

    for (let radio of btnRadios) {
      radio.onclick = (e) => {
        requestData[facialPart] = e.target.value;
        btn_next.classList.remove('disabled');
        console.log(requestData);
      }
    }
  }

  render({ facialPart: actionKeys[currentIndex], actionAus: actionValue[currentIndex] });
}

const showResult = async (requestData, aus) => {
  containerQuestion.classList.add('hide')
  const resultHTML = [];
  for (const facialPart in requestData) {
    const auDescription = aus.find(i => i.au === requestData[facialPart]);
    if (!auDescription) continue;
    const { au, img: imgUrl, description } = auDescription;
    const elementHtml = `
      <li class="facial_part emotion_item">
          <p>${facialParts[au]}</p>
          <div>
              <img src="${imgUrl}" alt="img-aus"
                  class="emotion_item-img">
              <p>${description}</p>
          </div>
      </li>
    `;
    resultHTML.push(elementHtml);
  };

  wrapper.innerHTML = `
    <h2>Trường hợp đã chọn</h2>
    <ul class="facial_parts emotion_items">${resultHTML.join('')}</ul> 
    <button class="btn btn_previous">Quay lại</button>
    <button class="btn btn_submit">Xem kết quả</button>
  `;
  const btnPrev = document.querySelector('.btn_previous');
  const btnSubmit =document.querySelector('.btn_submit');
  const wrapResult = document.querySelector('.result');
  btnPrev.onclick = () =>{
    containerQuestion.classList.remove('hide');
    wrapResult.remove();
  }
  btnSubmit.onclick = async () => {
    console.log(requestData)
    const response = await postData('http://localhost:4000/', requestData);
    console.log(response);
    // const result = document.createElement('div');
    // result.textContent = response.data;
    // wrapResult.appendChild(result);
  }
}

run();
