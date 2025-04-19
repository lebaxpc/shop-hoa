// netlify/functions/sendOrder.js

exports.handler = async (event) => {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    const TELEGRAM_MESSAGE_THREAD_ID = process.env.TELEGRAM_MESSAGE_THREAD_ID;
  
    const data = JSON.parse(event.body);
    const { name, phone, address, orderDetails, total } = data;
  
    const message = `Đơn hàng mới:\nKhách: ${name}\nSĐT: ${phone}\nĐịa chỉ: ${address}\nSản phẩm:\n${orderDetails}\nTổng: ${total} VNĐ`;
  
    const encodedMessage = encodeURIComponent(message);
  
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&message_thread_id=${TELEGRAM_MESSAGE_THREAD_ID}&text=${encodedMessage}`);
    const result = await response.json();
  
    if (result.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: "Đơn hàng đã được gửi!" }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, message: result.description }),
      };
    }
  };
  