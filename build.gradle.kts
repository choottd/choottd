/*
 * Copyright 2021 Giordano Battilana
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import com.moowork.gradle.node.yarn.YarnTask

val ktor_version: String by project
val kodeindb_version: String by project
val kotlin_version: String by project
val logback_version: String by project

plugins {
    application
    kotlin("jvm") version "1.4.21"
    id("com.github.node-gradle.node") version "2.2.4"
    maven
    id("org.jetbrains.kotlin.plugin.serialization") version "1.4.21"
}

group = "org.choottd"
version = "0.0.1"

application {
    mainClassName = "io.ktor.server.netty.EngineMain"
}

repositories {
    mavenLocal()
    jcenter()
    maven { url = uri("https://kotlin.bintray.com/ktor") }
    maven { url = uri("https://dl.bintray.com/kodein-framework/Kodein-DB") }
    maven { url = uri("https://kotlin.bintray.com/kotlinx") }
    maven {
        url = uri("https://maven.pkg.github.com/choottd/librcon")
        credentials {
            username = project.findProperty("gpr.user") as String? ?: System.getenv("USERNAME")
            password = project.findProperty("gpr.key") as String? ?: System.getenv("TOKEN")
        }
    }
}

dependencies {
    implementation("org.choottd:librcon:0.1.0-SNAPSHOT")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8:$kotlin_version")

    implementation("io.ktor:ktor-server-netty:$ktor_version")
    implementation("io.ktor:ktor-server-core:$ktor_version")
    implementation("io.ktor:ktor-server-host-common:$ktor_version")
    implementation("io.ktor:ktor-websockets:$ktor_version")
    implementation("io.ktor:ktor-jackson:$ktor_version")

    implementation("ch.qos.logback:logback-classic:$logback_version")

    implementation("org.kodein.db:kodein-db-jvm:$kodeindb_version")
    implementation("org.kodein.db:kodein-leveldb-jni-jvm:$kodeindb_version")
    implementation("org.kodein.db:kodein-db-serializer-kotlinx:$kodeindb_version")

    testImplementation("io.ktor:ktor-server-tests:$ktor_version")
}

kotlin.sourceSets["main"].kotlin.srcDirs("src")
kotlin.sourceSets["test"].kotlin.srcDirs("test")

sourceSets["main"].resources.srcDirs("resources")
sourceSets["test"].resources.srcDirs("testresources")


tasks.register("yarnInstall", YarnTask::class) {
    description = "Installs all dependencies from package.json"
    setWorkingDir(file("${project.projectDir}/client"))
    args = listOf("install")
}

tasks.register("yarnBuild", YarnTask::class) {
    dependsOn(tasks.named("yarnInstall"))
    description = "Builds production version of the webapp"
    setWorkingDir(file("${project.projectDir}/client"))
    args = listOf("build")
}

tasks.register("uiProd", Copy::class) {
    dependsOn(tasks.named("yarnBuild"))
    from("client/build")
    into("build/resources/main/static/.")
}

tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile::class).all {
    kotlinOptions {
        jvmTarget = "11"
    }
}

//tasks.named("compileJava") {
//    dependsOn(tasks.named("uiProd"))
//}

node {
    version = "14.15.4"
    download = true
}
