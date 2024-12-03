$(document).ready(function () {
  let countdownInterval;

  // 초기 상태에서 모달을 숨김
  $("#modal").hide();

  // 모달 열기
  $(".hover-group").on("click", function () {
    const itemName = $(this).data("item"); // 아이템 이름 가져오기
    $("#modal-message").text(`${itemName}을(를) 구매한다`);
    $("#modal").fadeIn(); // 클릭 시 모달 표시
  });

  // 모달 닫기
  $("#cancel-button").on("click", function () {
    $("#modal").fadeOut(); // 모달 숨기기
  });

  // 구매 버튼 동작
  $("#buy-button").on("click", function () {
    $("#modal-message")
      .attr("class", "modal-message-success")
      .html(`성공 구매!<br>물건이 로켓을 탔다!`);
    $(".modal-buttons").hide(); // 버튼 숨기기

    $("#modal-message").append('<p class="countdown">도착까지 00:00:10</p>');
    let countdown = 10;

    // 카운트다운 시작
    countdownInterval = setInterval(() => {
      countdown--;
      $(".countdown").text(`도착까지 00:00:${countdown.toString().padStart(2, "0")}`);
      if (countdown === 0) {
        clearInterval(countdownInterval);
        showArrivalMessage(); // 도착 메시지 표시
      }
    }, 1000);
  });

  // 도착 메시지 표시
  function showArrivalMessage() {
    $("#modal-message")
      .attr("class", "modal-message-arrival")
      .html("도착!");

    // 2초 후 모달 자동 닫기
    setTimeout(() => {
      $("#modal").fadeOut();
    }, 2000); // 2000ms = 2초
  }
});

  
  