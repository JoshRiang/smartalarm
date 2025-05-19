// this is a simulation program for arduino using C (but not use pyseriel yet)
// compile with: gcc -o arduino_simulation arduino_simulation.c -lws2_32
// dont forget to include -lws2_32 in the compile command
#define _WINSOCK_DEPRECATED_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>
#include <winsock2.h>
#include <time.h>
#include <windows.h>

#pragma comment(lib, "ws2_32.lib")

float get_random_float() {
    return (float)(rand() % 2000 - 1000) / 100.0f;
}

void get_timestamp(char* buffer, int len) {
    time_t now = time(NULL);
    struct tm* t = localtime(&now);
    strftime(buffer, len, "%Y-%m-%d %H:%M:%S", t);
}

int main() {
    WSADATA wsa;
    SOCKET sock;
    struct sockaddr_in server;
    char message[128];

    printf("Inisialisasi Winsock...\n");
    WSAStartup(MAKEWORD(2,2), &wsa);

    sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock == INVALID_SOCKET) {
        printf("Gagal membuat socket\n");
        return 1;
    }

    server.sin_addr.s_addr = inet_addr("127.0.0.1");
    server.sin_family = AF_INET;
    server.sin_port = htons(12345);

    if (connect(sock, (struct sockaddr *)&server, sizeof(server)) < 0) {
        printf("Koneksi gagal\n");
        return 1;
    }

    printf("Terhubung ke Python server!\n");

    while (1) {
        char timestamp[32];
        get_timestamp(timestamp, sizeof(timestamp));

        float x = get_random_float();
        float y = get_random_float();
        float z = get_random_float();

        snprintf(message, sizeof(message), "%s,%.2f,%.2f,%.2f\n", timestamp, x, y, z);
        send(sock, message, strlen(message), 0);

        printf("Terkirim: %s", message);
        Sleep(1000); // delay 1 detik
    }

    closesocket(sock);
    WSACleanup();
    return 0;
}
